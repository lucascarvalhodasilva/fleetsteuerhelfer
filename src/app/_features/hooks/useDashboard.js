import { useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';

export const useDashboard = () => {
  const { tripEntries, mileageEntries, equipmentEntries, expenseEntries, monthlyEmployerExpenses, selectedYear, taxRates } = useAppContext();

  // Filter entries by selected year
  const filteredTrips = useMemo(() => 
    tripEntries.filter(e => new Date(e.date).getFullYear() === selectedYear),
  [tripEntries, selectedYear]);

  const filteredMileage = useMemo(() => 
    mileageEntries.filter(e => new Date(e.date).getFullYear() === selectedYear),
  [mileageEntries, selectedYear]);

  const filteredExpenses = useMemo(() => 
    (expenseEntries || []).filter(e => new Date(e.date).getFullYear() === selectedYear),
  [expenseEntries, selectedYear]);

  const filteredMonthlyExpenses = useMemo(() => 
    (monthlyEmployerExpenses || []).filter(e => e.year === selectedYear),
  [monthlyEmployerExpenses, selectedYear]);

  const totalTrips = useMemo(() => 
    filteredTrips.reduce((sum, entry) => sum + entry.deductible, 0),
  [filteredTrips]);

  const totalMileage = useMemo(() => 
    filteredMileage.reduce((sum, entry) => sum + entry.allowance, 0),
  [filteredMileage]);
  
  // Calculate Equipment Depreciation for Selected Year
  const totalEquipment = useMemo(() => equipmentEntries.reduce((sum, entry) => {
    const purchaseDate = new Date(entry.date);
    const purchaseYear = purchaseDate.getFullYear();
    const currentYear = parseInt(selectedYear);
    const price = parseFloat(entry.price);
    
    // GWG
    if (price <= (taxRates?.gwgLimit || 952)) {
        return purchaseYear === currentYear ? sum + price : sum;
    }
    
    // Depreciation
    const usefulLifeYears = 3;
    const endYear = purchaseYear + usefulLifeYears;
    
    if (currentYear < purchaseYear || currentYear > endYear) return sum;
    
    let monthsInCurrentYear = 0;
    if (currentYear === purchaseYear) {
        monthsInCurrentYear = 12 - purchaseDate.getMonth();
    } else if (currentYear < endYear) {
        monthsInCurrentYear = 12;
    } else if (currentYear === endYear) {
        monthsInCurrentYear = purchaseDate.getMonth();
    }
    
    if (monthsInCurrentYear <= 0) return sum;
    
    const monthlyDepreciation = price / (usefulLifeYears * 12);
    return sum + (monthlyDepreciation * monthsInCurrentYear);
  }, 0), [equipmentEntries, selectedYear, taxRates]);

  const totalEmployerReimbursement = useMemo(() => 
    filteredMonthlyExpenses.reduce((sum, entry) => sum + entry.amount, 0),
  [filteredMonthlyExpenses]);
  
  // Grand Total (Absetzbar) = (Trips + Mileage + Equipment) - Employer Reimbursements
  const grandTotal = (totalTrips + totalMileage + totalEquipment) - totalEmployerReimbursement;

  // KPI Calculations for Expenses vs Allowances
  const totalExpenses = useMemo(() => 
    filteredExpenses.reduce((sum, entry) => sum + entry.amount, 0),
  [filteredExpenses]);
  
  // Net Result (Absetzbar - Private Ausgaben)
  const netTotal = grandTotal - totalExpenses;

  // Combine and sort recent activities
  const recentActivities = useMemo(() => [
    ...tripEntries.map(e => ({ ...e, type: 'Verpflegung', amount: e.deductible })),
    ...mileageEntries.map(e => ({ ...e, type: 'Fahrt', amount: e.allowance })),
    ...equipmentEntries.map(e => ({ ...e, type: 'Arbeitsmittel', amount: e.deductibleAmount }))
  ]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5), [tripEntries, mileageEntries, equipmentEntries]);

  return {
    selectedYear,
    grandTotal,
    totalTrips,
    totalMileage,
    totalEquipment,
    totalEmployerReimbursement,
    totalExpenses,
    netTotal,
    recentActivities
  };
};
