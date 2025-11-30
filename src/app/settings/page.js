"use client";
import { useAppContext } from '@/context/AppContext';

export default function SettingsPage() {
  const { 
    employerRefundSettings, 
    setEmployerRefundSettings, 
    generateExampleData,
    stationDistance,
    setStationDistance,
    taxRates,
    setTaxRates
  } = useAppContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployerRefundSettings(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleTaxRateChange = (e) => {
    const { name, value } = e.target;
    setTaxRates(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  return (
    <div className="space-y-8 py-8 container-custom">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Einstellungen</h1>
        <p className="text-muted-foreground mt-1">Spezialisiert für Fahrzeugüberführer: Konfigurieren Sie Ihren festen Arbeitsweg zum lokalen Bahnhof.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-modern">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Gesetzliche Pauschalen</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Passen Sie die steuerlichen Pauschalen an, falls sich die Gesetzeslage ändert.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Verpflegungspauschale (ab 8h)</label>
              <input
                type="number"
                step="0.5"
                name="mealRate8h"
                className="input-modern"
                value={taxRates.mealRate8h}
                onChange={handleTaxRateChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Aktuell: 14,00 €</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Verpflegungspauschale (24h)</label>
              <input
                type="number"
                step="0.5"
                name="mealRate24h"
                className="input-modern"
                value={taxRates.mealRate24h}
                onChange={handleTaxRateChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Aktuell: 28,00 €</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Kilometerpauschale (€/km)</label>
              <input
                type="number"
                step="0.01"
                name="mileageRate"
                className="input-modern"
                value={taxRates.mileageRate}
                onChange={handleTaxRateChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Aktuell: 0,30 €</p>
            </div>
          </div>
        </div>

        <div className="card-modern">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Automatische Erstattung</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Legen Sie fest, ab wann und in welcher Höhe eine Erstattung durch den Arbeitgeber automatisch eingetragen wird.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Stunden-Schwellenwert (ab)</label>
              <input
                type="number"
                step="0.1"
                name="thresholdHours"
                className="input-modern"
                value={employerRefundSettings.thresholdHours}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Beispiel: 8.5 für "ab 8,5 Stunden"</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Erstattungsbetrag (€)</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                className="input-modern"
                value={employerRefundSettings.amount}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Betrag, der automatisch eingetragen wird.</p>
            </div>
          </div>
        </div>

        <div className="card-modern">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Fahrtkosten & Arbeitsweg</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Konfigurieren Sie Ihre tägliche Pendelstrecke. Diese wird automatisch jedem Arbeitstag hinzugefügt.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Einfache Strecke (km)</label>
              <input
                type="number"
                step="0.1"
                className="input-modern"
                value={stationDistance}
                onChange={(e) => setStationDistance(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Entfernung zum Arbeitsort/Bahnhof. Wird automatisch verdoppelt (Hin- & Rückweg).
              </p>
            </div>
          </div>
        </div>

        <div className="card-modern">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Entwickler-Optionen</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Generieren Sie Testdaten, um die Funktionalität der App zu prüfen.
          </p>
          <button 
            onClick={() => {
              generateExampleData();
              alert('Beispieldaten wurden hinzugefügt!');
            }}
            className="btn-secondary w-full"
          >
            Beispieldaten generieren
          </button>
        </div>
      </div>
    </div>
  );
}
