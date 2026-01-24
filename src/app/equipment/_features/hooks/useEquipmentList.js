import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Filesystem, Directory } from '@capacitor/filesystem';

export const useEquipmentList = () => {
  const { equipmentEntries, deleteEquipmentEntry, selectedYear, taxRates } = useAppContext();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState(null);

  const loadReceipt = async (fileName) => {
    try {
      const file = await Filesystem.readFile({
        path: `receipts/${fileName}`,
        directory: Directory.Documents
      });
      return `data:image/jpeg;base64,${file.data}`;
    } catch (e) {
      console.error('Error loading receipt:', e);
      return null;
    }
  };

  const handleViewReceipt = async (fileName) => {
    const base64 = await loadReceipt(fileName);
    if (base64) {
      setViewingReceipt(base64);
    } else {
      alert('Beleg konnte nicht geladen werden.');
    }
  };

  // Calculate deductible amount for each entry based on depreciation rules
  const calculateDeductible = (entry, forYear) => {
    const purchaseDate = new Date(entry.date);
    const purchaseYear = purchaseDate.getFullYear();
    const price = parseFloat(entry.price);
    const year = forYear || purchaseYear;
    
    // 1. GWG (<= Limit): Full amount in purchase year only
    if (price <= (taxRates?.gwgLimit || 952)) {
      return year === purchaseYear ? price : 0;
    }

    // 2. Depreciating Assets (> Limit)
    const usefulLifeYears = 3;
    const endYear = purchaseYear + usefulLifeYears; 
    
    if (year < purchaseYear || year > endYear) return 0;

    let monthsInYear = 0;
    
    if (year === purchaseYear) {
      monthsInYear = 12 - purchaseDate.getMonth();
    } else if (year < endYear) {
      monthsInYear = 12;
    } else if (year === endYear) {
      monthsInYear = purchaseDate.getMonth();
    }

    if (monthsInYear <= 0) return 0;

    const monthlyDepreciation = price / (usefulLifeYears * 12);
    return parseFloat((monthlyDepreciation * monthsInYear).toFixed(2));
  };

  const filteredEquipmentEntries = useMemo(() => {
    return equipmentEntries.map(entry => {
      const purchaseDate = new Date(entry.date);
      const purchaseYear = purchaseDate.getFullYear();
      const price = parseFloat(entry.price);
      
      // Calculate deductible for the entry's purchase year for display
      const deductible = calculateDeductible(entry, purchaseYear);
      
      // For GWG items, show full amount
      if (price <= (taxRates?.gwgLimit || 952)) {
        return {
          ...entry,
          deductibleAmount: price,
          status: 'GWG (Sofortabzug)'
        };
      }

      // For depreciating assets, calculate based on purchase year
      const usefulLifeYears = 3;
      const monthsInPurchaseYear = 12 - purchaseDate.getMonth();

      return {
        ...entry,
        deductibleAmount: deductible,
        status: `Abschreibung ${purchaseYear} (${monthsInPurchaseYear} Mon.)`
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [equipmentEntries, taxRates]);

  return {
    filteredEquipmentEntries,
    deleteEquipmentEntry,
    selectedYear,
    isFullScreen,
    setIsFullScreen,
    viewingReceipt,
    setViewingReceipt,
    handleViewReceipt
  };
};
