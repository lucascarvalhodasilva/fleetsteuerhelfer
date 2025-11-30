"use client";
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function MealsPage() {
  const { 
    mealEntries, 
    addMealEntry, 
    deleteMealEntry, 
    employerRefundSettings, 
    addMileageEntry,
    mileageEntries,
    deleteMileageEntry,
    stationDistance,
    selectedYear,
    taxRates
  } = useAppContext();
  
  const [formData, setFormData] = useState({
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
    employerExpenses: 0
  });
  const [autoAddStationTrips, setAutoAddStationTrips] = useState(true);

  useEffect(() => {
    // Always enable auto-add if station distance is set
    if (stationDistance > 0) {
      setAutoAddStationTrips(true);
    }
  }, [stationDistance]);

  const calculateAllowance = (startDateStr, startTimeStr, endDateStr, endTimeStr) => {
    // If no end date is provided, assume same day (or next day if time is earlier, handled by logic below if we want)
    // But now we have explicit end date field.
    
    const start = new Date(`${startDateStr}T${startTimeStr}`);
    const end = new Date(`${endDateStr || startDateStr}T${endTimeStr}`);
    
    let diff = (end - start) / 1000 / 60 / 60; // hours
    
    // Fallback for legacy behavior if endDate is missing but time wraps (though with explicit field this is less needed)
    if (diff < 0 && !endDateStr) diff += 24; 

    let rate = 0;
    if (diff >= 24) rate = taxRates.mealRate24h;
    else if (diff >= 8) rate = taxRates.mealRate8h;

    return { duration: diff, rate };
  };

  // Auto-calculate employer refund based on settings
  useEffect(() => {
    if (formData.date && formData.startTime && formData.endTime && employerRefundSettings) {
      const { duration } = calculateAllowance(formData.date, formData.startTime, formData.endDate, formData.endTime);
      if (duration >= employerRefundSettings.thresholdHours) {
        setFormData(prev => ({ ...prev, employerExpenses: employerRefundSettings.amount }));
      } else {
        setFormData(prev => ({ ...prev, employerExpenses: 0 }));
      }
    }
  }, [formData.date, formData.endDate, formData.startTime, formData.endTime, employerRefundSettings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { duration, rate } = calculateAllowance(formData.date, formData.startTime, formData.endDate, formData.endTime);
    const deductible = Math.max(0, rate - parseFloat(formData.employerExpenses));

    addMealEntry({
      ...formData,
      endDate: formData.endDate || formData.date, // Ensure endDate is saved
      duration,
      rate,
      deductible: parseFloat(deductible.toFixed(2))
    });

    // Auto-add station trips
    if (autoAddStationTrips && stationDistance > 0) {
      const allowance = parseFloat((stationDistance * taxRates.mileageRate).toFixed(2));
      
      // Trip to station (Start Date)
      addMileageEntry({
        date: formData.date,
        startLocation: 'Zuhause',
        endLocation: 'Bahnhof',
        distance: stationDistance,
        totalKm: stationDistance,
        allowance: allowance,
        purpose: 'Fahrt zum Bahnhof (Dienstreise Beginn)'
      });

      // Trip from station (End Date)
      addMileageEntry({
        date: formData.endDate || formData.date,
        startLocation: 'Bahnhof',
        endLocation: 'Zuhause',
        distance: stationDistance,
        totalKm: stationDistance,
        allowance: allowance,
        purpose: 'Fahrt vom Bahnhof (Dienstreise Ende)'
      });
    }

    setFormData({ ...formData, startTime: '', endTime: '', endDate: '', employerExpenses: 0 });
  };

  const filteredMealEntries = mealEntries.filter(entry => new Date(entry.date).getFullYear() === parseInt(selectedYear));

  return (
    <div className="space-y-8 py-8 container-custom">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Werbungskosten</h1>
        <p className="text-muted-foreground mt-1">Tragen Sie Ihre Abwesenheitszeiten ein – Verpflegungspauschalen und Fahrtkosten werden automatisch ermittelt.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6 lg:col-span-1">
          <div className="card-modern">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Neuer Eintrag</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Startdatum</label>
                  <input
                    type="date"
                    required
                    className="input-modern"
                    value={formData.date}
                    onChange={e => {
                      const newDate = e.target.value;
                      // If end date is empty or before new start date, update it
                      if (!formData.endDate || formData.endDate < newDate) {
                        setFormData({...formData, date: newDate, endDate: newDate});
                      } else {
                        setFormData({...formData, date: newDate});
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Enddatum</label>
                  <input
                    type="date"
                    required
                    className="input-modern"
                    min={formData.date}
                    value={formData.endDate || formData.date}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Startzeit</label>
                  <input
                    type="time"
                    required
                    className="input-modern"
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Endzeit</label>
                  <input
                    type="time"
                    required
                    className="input-modern"
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                  />
                </div>
              </div>

              {formData.employerExpenses > 0 && (
                <div className="p-3 bg-muted/30 rounded-md border border-border/50">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Automatische Erstattung: <strong>{formData.employerExpenses.toFixed(2)} €</strong>
                  </p>
                </div>
              )}

              {stationDistance > 0 && (
                <div className="p-3 bg-muted/30 rounded-md border border-border/50">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                    Automatische Fahrtkosten: <strong>{stationDistance * 2} km</strong> (Hin & Zurück)
                  </p>
                </div>
              )}

              <button type="submit" className="w-full btn-primary mt-2">
                Hinzufügen
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2">
          <div className="card-modern h-full">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Einträge</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-modern">
                <thead>
                  <tr>
                    <th className="whitespace-nowrap min-w-[110px]">Datum</th>
                    <th className="whitespace-nowrap min-w-[130px]">Zeit</th>
                    <th className="whitespace-nowrap">Dauer</th>
                    <th className="whitespace-nowrap">Pauschale</th>
                    <th className="whitespace-nowrap">Erstattung (AG)</th>
                    <th className="whitespace-nowrap">Fahrt (Hin)</th>
                    <th className="whitespace-nowrap">Fahrt (Rück)</th>
                    <th className="whitespace-nowrap">Gesamt</th>
                    <th className="w-[80px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMealEntries.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted-foreground py-8">Keine Einträge für {selectedYear} vorhanden.</td>
                    </tr>
                  ) : (
                    filteredMealEntries.map(entry => {
                      // Find associated mileage entries for this date range
                      const dayMileage = mileageEntries.filter(m => m.date === entry.date || m.date === entry.endDate);
                      const tripTo = dayMileage.find(m => m.date === entry.date && m.purpose && m.purpose.includes('Beginn'));
                      const tripFrom = dayMileage.find(m => (m.date === (entry.endDate || entry.date)) && m.purpose && m.purpose.includes('Ende'));
                      
                      const amountTo = tripTo ? tripTo.allowance : 0;
                      const amountFrom = tripFrom ? tripFrom.allowance : 0;
                      const totalDeductible = entry.deductible + amountTo + amountFrom;

                      const isMultiDay = entry.endDate && entry.endDate !== entry.date;

                      return (
                        <tr key={entry.id}>
                          <td className="whitespace-nowrap font-medium">
                            {entry.date}
                            {isMultiDay && <span className="text-xs text-muted-foreground block">bis {entry.endDate}</span>}
                          </td>
                          <td className="whitespace-nowrap">{entry.startTime} - {entry.endTime}</td>
                          <td className="whitespace-nowrap">{entry.duration.toFixed(1)} h</td>
                          <td className="whitespace-nowrap">{entry.rate.toFixed(2)} €</td>
                          <td className="whitespace-nowrap text-destructive">-{parseFloat(entry.employerExpenses).toFixed(2)} €</td>
                          <td className="whitespace-nowrap text-muted-foreground">{amountTo > 0 ? `${amountTo.toFixed(2)} €` : '-'}</td>
                          <td className="whitespace-nowrap text-muted-foreground">{amountFrom > 0 ? `${amountFrom.toFixed(2)} €` : '-'}</td>
                          <td className="whitespace-nowrap font-bold text-primary">{totalDeductible.toFixed(2)} €</td>
                          <td className="text-right whitespace-nowrap">
                            <button 
                              onClick={() => {
                                deleteMealEntry(entry.id);
                                // Also delete associated mileage entries
                                dayMileage.forEach(m => deleteMileageEntry(m.id));
                              }} 
                              className="text-destructive hover:text-destructive/80 text-sm font-medium transition-colors"
                            >
                              Löschen
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
