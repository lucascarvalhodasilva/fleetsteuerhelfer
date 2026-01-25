import React, { useState, useEffect } from 'react';

/**
 * Quick-add form for monthly employer reimbursements (Spesen)
 * Pre-filled with the next available month for the selected year
 * 
 * @param {Object} props
 * @param {number} props.year - Selected year
 * @param {Function} props.onAdd - Callback when spesen is added
 * @param {Array} props.existingSpesen - Array of existing spesen for the year
 * @returns {JSX.Element}
 */
export default function SpesenQuickAdd({ year, onAdd, existingSpesen }) {
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  // Pre-select the next available month when component mounts or existing spesen changes
  useEffect(() => {
    const existingMonths = new Set(existingSpesen.map(s => s.month));
    // Find the first month without data
    for (let month = 1; month <= 12; month++) {
      if (!existingMonths.has(month)) {
        setSelectedMonth(month);
        return;
      }
    }
    // If all months have data, default to current month
    const currentMonth = new Date().getMonth() + 1;
    setSelectedMonth(currentMonth);
  }, [existingSpesen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum < 0) {
      setError('Bitte geben Sie einen gültigen Betrag ein (≥ 0)');
      return;
    }

    if (note && note.length > 200) {
      setError('Notiz darf maximal 200 Zeichen haben');
      return;
    }

    // Check for duplicate month/year
    const isDuplicate = existingSpesen.some(s => s.month === selectedMonth && s.year === year);
    if (isDuplicate) {
      setError(`${months[selectedMonth - 1]} ${year} ist bereits erfasst`);
      return;
    }

    // Create entry
    const entry = {
      month: selectedMonth,
      year,
      amount: amountNum,
      note: note.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAdd(entry);
    
    // Reset form
    setAmount('');
    setNote('');
    setError('');
    
    // Select next available month
    const existingMonths = new Set([...existingSpesen.map(s => s.month), selectedMonth]);
    for (let month = 1; month <= 12; month++) {
      if (!existingMonths.has(month)) {
        setSelectedMonth(month);
        return;
      }
    }
  };

  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl">
      <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-400 mb-3">
        ➕ Schnell hinzufügen
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Month Selector */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Monat</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            {months.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month} {year}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Betrag</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
          </div>
        </div>

        {/* Note Input (Optional) */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Notiz <span className="text-xs text-muted-foreground/60">(optional, max 200 Zeichen)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="z.B. Monatspauschale"
            maxLength={200}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
          {note && (
            <p className="text-xs text-muted-foreground/60 mt-1">{note.length}/200</p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Hinzufügen
        </button>
      </form>
    </div>
  );
}
