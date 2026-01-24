import { useMemo, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Hook to manage trip list data and operations.
 */
export const useTripList = () => {
  const { 
    tripEntries, 
    deleteTripEntry, 
    mileageEntries, 
    deleteMileageEntry, 
    selectedYear 
  } = useAppContext();

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

  const tripEntriesSorted = useMemo(() => 
    tripEntries
      .sort((a, b) => new Date(b.date) - new Date(a.date)), 
  [tripEntries]);

  const handleDeleteEntry = (entryId, entryDate, entryEndDate) => {
    deleteTripEntry(entryId);
    
    // Delete by relatedTripId
    const relatedMileage = mileageEntries.filter(m => m.relatedTripId === entryId);
    if (relatedMileage.length > 0) {
      relatedMileage.forEach(m => deleteMileageEntry(m.id));
    } else {
      // Fallback for legacy entries
      const legacyMileage = mileageEntries.filter(m => 
        !m.relatedTripId && 
        (m.date === entryDate || (entryEndDate && m.date === entryEndDate))
      );
      legacyMileage.forEach(m => deleteMileageEntry(m.id));
    }
  };

  return {
    tripEntries: tripEntriesSorted,
    mileageEntries,
    handleDeleteEntry,
    selectedYear,
    viewingReceipt,
    setViewingReceipt,
    handleViewReceipt
  };
};
