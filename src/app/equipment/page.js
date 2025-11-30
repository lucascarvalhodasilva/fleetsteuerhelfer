"use client";
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function EquipmentPage() {
  const { equipmentEntries, addEquipmentEntry, deleteEquipmentEntry, selectedYear } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    date: '',
    price: '',
    reimbursed: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(formData.price);
    const isDeductibleImmediately = price <= 952; // GWG limit
    
    // If reimbursed, deductible is 0. If not reimbursed and <= 952, full price. If > 952, needs depreciation (simplified here to 0 for now or full price with warning)
    // Requirement says: > 952 -> Nutzungsdauer berücksichtigen (optional).
    // For simplicity, we'll mark it as "Abschreibung nötig" if > 952.
    
    let deductibleAmount = 0;
    let status = '';

    if (formData.reimbursed) {
      deductibleAmount = 0;
      status = 'Erstattet';
    } else if (isDeductibleImmediately) {
      deductibleAmount = price;
      status = 'Sofort absetzbar (GWG)';
    } else {
      deductibleAmount = 0; // Or handle depreciation logic
      status = 'Abschreibung erforderlich (> 952€)';
    }

    addEquipmentEntry({
      ...formData,
      price,
      deductibleAmount,
      status
    });

    setFormData({
      name: '',
      category: '',
      date: '',
      price: '',
      reimbursed: false
    });
  };

  const filteredEquipmentEntries = equipmentEntries.filter(entry => new Date(entry.date).getFullYear() === parseInt(selectedYear));

  return (
    <div className="space-y-8 py-8 container-custom">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Arbeitsmittel</h1>
        <p className="text-muted-foreground mt-1">Verwalten Sie Ihre Arbeitsmittel und GWG (Geringwertige Wirtschaftsgüter).</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6 lg:col-span-1">
          <div className="card-modern">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Neues Arbeitsmittel</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Bezeichnung</label>
                <input
                  type="text"
                  required
                  className="input-modern"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Kategorie</label>
                <input
                  type="text"
                  className="input-modern"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Kaufdatum</label>
                <input
                  type="date"
                  required
                  className="input-modern"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Preis (Brutto €)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input-modern"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="reimbursed"
                  className="h-4 w-4 rounded border-input bg-transparent text-primary focus:ring-primary"
                  checked={formData.reimbursed}
                  onChange={e => setFormData({...formData, reimbursed: e.target.checked})}
                />
                <label htmlFor="reimbursed" className="ml-2 block text-sm text-foreground">
                  Vom Arbeitgeber erstattet?
                </label>
              </div>
              <button type="submit" className="w-full btn-primary mt-2">
                Hinzufügen
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-2">
          <div className="card-modern h-full">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Inventarliste</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-modern">
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Gegenstand</th>
                    <th>Preis</th>
                    <th>Status</th>
                    <th>Absetzbar</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEquipmentEntries.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted-foreground py-8">Keine Arbeitsmittel für {selectedYear} vorhanden.</td>
                    </tr>
                  ) : (
                    filteredEquipmentEntries.map(entry => (
                      <tr key={entry.id}>
                        <td>{entry.date}</td>
                        <td>
                          <div className="font-medium text-foreground">{entry.name}</div>
                          <div className="text-xs text-muted-foreground">{entry.category}</div>
                        </td>
                        <td>{entry.price.toFixed(2)} €</td>
                        <td className="text-sm text-muted-foreground">{entry.status}</td>
                        <td className="font-bold text-primary">{entry.deductibleAmount.toFixed(2)} €</td>
                        <td className="text-right">
                          <button onClick={() => deleteEquipmentEntry(entry.id)} className="text-destructive hover:text-destructive/80 text-sm font-medium">Löschen</button>
                        </td>
                      </tr>
                    ))
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
