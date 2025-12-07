import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export const useSettings = () => {
  const { 
    defaultCommute,
    setDefaultCommute,
    taxRates
  } = useAppContext();

  // Local state for manual saving
  const [localDefaultCommute, setLocalDefaultCommute] = useState(defaultCommute || {
    car: { active: true, distance: 0 },
    motorcycle: { active: false, distance: 0 },
    bike: { active: false, distance: 0 },
    public_transport: { active: false, cost: '' }
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with context on mount or when context updates (if no local changes)
  useEffect(() => {
    if (!hasChanges) {
      setLocalDefaultCommute(defaultCommute || {
        car: { active: true, distance: 0 },
        motorcycle: { active: false, distance: 0 },
        bike: { active: false, distance: 0 },
        public_transport: { active: false, cost: '' }
      });
    }
  }, [defaultCommute, hasChanges]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setDefaultCommute(localDefaultCommute);
      setHasChanges(false);
      setIsSaving(false);
    }, 1300);
  };

  return {
    localDefaultCommute,
    setLocalDefaultCommute,
    hasChanges,
    setHasChanges,
    isSaving,
    handleSave,
    taxRates // Needed for displaying current values
  };
};
