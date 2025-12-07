"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Filesystem, Directory } from '@capacitor/filesystem';

const AppContext = createContext();

// Helper to delete receipt files
const deleteReceiptFiles = async (receiptFileName, dateStr) => {
  if (!receiptFileName) return;

  try {
    // Delete from Directory.Documents (receipts folder)
    try {
      await Filesystem.deleteFile({
        path: `receipts/${receiptFileName}`,
        directory: Directory.Documents
      });
    } catch (e) {
      console.warn(`Failed to delete internal receipt ${receiptFileName}:`, e);
    }
  } catch (e) {
    console.error("Error in deleteReceiptFiles:", e);
  }
};

export function AppProvider({ children }) {
  const [mealEntries, setMealEntries] = useState([]);
  const [mileageEntries, setMileageEntries] = useState([]);
  const [equipmentEntries, setEquipmentEntries] = useState([]);
  const [expenseEntries, setExpenseEntries] = useState([]);
  const [monthlyEmployerExpenses, setMonthlyEmployerExpenses] = useState([]);
  const [defaultCommute, setDefaultCommute] = useState({
    car: { active: true, distance: 0 },
    motorcycle: { active: false, distance: 0 },
    bike: { active: false, distance: 0 },
    public_transport: { active: false, cost: '' }
  });
  const [taxRates, setTaxRates] = useState({
    mealRate8h: 14.0,
    mealRate24h: 28.0,
    mileageRate: 0.30,
    mileageRateCar: 0.30,
    mileageRateMotorcycle: 0.20,
    mileageRateBike: 0.05,
    gwgLimit: 952.0
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Load from local storage on mount
  useEffect(() => {
    const storedMeals = localStorage.getItem('mealEntries');
    const storedMileage = localStorage.getItem('mileageEntries');
    const storedEquipment = localStorage.getItem('equipmentEntries');
    const storedExpenses = localStorage.getItem('expenseEntries');
    const storedMonthlyExpenses = localStorage.getItem('monthlyEmployerExpenses');
    const storedDefaultCommute = localStorage.getItem('defaultCommute');
    const storedTaxRates = localStorage.getItem('taxRates');
    const storedYear = localStorage.getItem('selectedYear');

    if (storedMeals) setMealEntries(JSON.parse(storedMeals));
    if (storedMileage) setMileageEntries(JSON.parse(storedMileage));
    if (storedEquipment) setEquipmentEntries(JSON.parse(storedEquipment));
    if (storedExpenses) setExpenseEntries(JSON.parse(storedExpenses));
    if (storedMonthlyExpenses) setMonthlyEmployerExpenses(JSON.parse(storedMonthlyExpenses));
    if (storedDefaultCommute) setDefaultCommute(JSON.parse(storedDefaultCommute));
    if (storedTaxRates) {
      const parsedRates = JSON.parse(storedTaxRates);
      setTaxRates(prev => ({ ...prev, ...parsedRates }));
    }
    // if (storedYear) setSelectedYear(JSON.parse(storedYear)); // Always start with current year
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('mealEntries', JSON.stringify(mealEntries));
  }, [mealEntries]);

  useEffect(() => {
    localStorage.setItem('mileageEntries', JSON.stringify(mileageEntries));
  }, [mileageEntries]);

  useEffect(() => {
    localStorage.setItem('equipmentEntries', JSON.stringify(equipmentEntries));
  }, [equipmentEntries]);

  useEffect(() => {
    localStorage.setItem('expenseEntries', JSON.stringify(expenseEntries));
  }, [expenseEntries]);

  useEffect(() => {
    localStorage.setItem('monthlyEmployerExpenses', JSON.stringify(monthlyEmployerExpenses));
  }, [monthlyEmployerExpenses]);

  useEffect(() => {
    localStorage.setItem('defaultCommute', JSON.stringify(defaultCommute));
  }, [defaultCommute]);

  useEffect(() => {
    localStorage.setItem('taxRates', JSON.stringify(taxRates));
  }, [taxRates]);

  useEffect(() => {
    localStorage.setItem('selectedYear', JSON.stringify(selectedYear));
  }, [selectedYear]);

  const addMealEntry = (entry) => {
    const newEntry = { ...entry, id: entry.id || Date.now() };
    setMealEntries(prev => [...prev, newEntry]);
  };

  const deleteMealEntry = (id) => {
    setMealEntries(prev => prev.filter(e => e.id !== id));
  };

  const updateMealEntry = (id, updatedEntry) => {
    setMealEntries(prev => prev.map(entry => entry.id === id ? { ...entry, ...updatedEntry } : entry));
  };

  const addMileageEntry = (entry) => {
    setMileageEntries(prev => [...prev, { ...entry, id: Date.now() + Math.random() }]);
  };

  const deleteMileageEntry = (id) => {
    setMileageEntries(prev => {
      const entry = prev.find(e => e.id === id);
      if (entry && entry.receiptFileName) {
        deleteReceiptFiles(entry.receiptFileName, entry.date);
      }
      return prev.filter(e => e.id !== id);
    });
  };

  const getMileageRate = (vehicleType) => {
    switch (vehicleType) {
      case 'motorcycle':
        return taxRates.mileageRateMotorcycle || 0.20;
      case 'bike':
        return taxRates.mileageRateBike || 0.05;
      case 'car':
      default:
        return taxRates.mileageRateCar || 0.30;
    }
  };

  const addEquipmentEntry = (entry) => {
    setEquipmentEntries(prev => [...prev, { ...entry, id: entry.id || Date.now() }]);
  };

  const updateEquipmentEntry = (updatedEntry) => {
    setEquipmentEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };

  const deleteEquipmentEntry = (id) => {
    setEquipmentEntries(prev => {
      const entry = prev.find(e => e.id === id);
      if (entry && entry.receiptFileName) {
        deleteReceiptFiles(entry.receiptFileName, entry.date);
      }
      return prev.filter(e => e.id !== id);
    });
  };

  const addMonthlyEmployerExpense = (entry) => {
    setMonthlyEmployerExpenses(prev => {
      const existingIndex = prev.findIndex(e => e.year === entry.year && e.month === entry.month);
      if (existingIndex >= 0) {
        const newArr = [...prev];
        newArr[existingIndex] = { ...newArr[existingIndex], ...entry };
        return newArr;
      }
      return [...prev, { ...entry, id: Date.now() }];
    });
  };

  const deleteMonthlyEmployerExpense = (id) => {
    setMonthlyEmployerExpenses(prev => prev.filter(e => e.id !== id));
  };

  const addExpenseEntry = (entry) => {
    setExpenseEntries(prev => [...prev, { ...entry, id: entry.id || Date.now() }]);
  };

  const deleteExpenseEntry = (id) => {
    setExpenseEntries(prev => {
      const entry = prev.find(e => e.id === id);
      if (entry && entry.receiptFileName) {
        deleteReceiptFiles(entry.receiptFileName, entry.date);
      }
      return prev.filter(e => e.id !== id);
    });
  };

  const importData = (data) => {
    if (!data) return false;
    
    try {
      if (data.mealEntries) setMealEntries(data.mealEntries);
      if (data.mileageEntries) setMileageEntries(data.mileageEntries);
      if (data.equipmentEntries) setEquipmentEntries(data.equipmentEntries);
      if (data.expenseEntries) setExpenseEntries(data.expenseEntries);
      if (data.monthlyEmployerExpenses) setMonthlyEmployerExpenses(data.monthlyEmployerExpenses);
      if (data.defaultCommute) setDefaultCommute(data.defaultCommute);
      if (data.taxRates) setTaxRates(data.taxRates);
      if (data.selectedYear) setSelectedYear(data.selectedYear);
      return true;
    } catch (e) {
      console.error("Import failed", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      mealEntries, addMealEntry, deleteMealEntry, updateMealEntry,
      mileageEntries, addMileageEntry, deleteMileageEntry,
      equipmentEntries, addEquipmentEntry, deleteEquipmentEntry, updateEquipmentEntry,
      expenseEntries, addExpenseEntry, deleteExpenseEntry,
      monthlyEmployerExpenses, addMonthlyEmployerExpense, deleteMonthlyEmployerExpense,
      defaultCommute, setDefaultCommute,
      taxRates, setTaxRates, getMileageRate,
      selectedYear, setSelectedYear,
      importData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
