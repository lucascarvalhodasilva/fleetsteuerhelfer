"use client";
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function Dashboard() {
  const { mealEntries, mileageEntries, equipmentEntries, selectedYear } = useAppContext();

  // Filter entries by selected year
  const filteredMeals = mealEntries.filter(e => new Date(e.date).getFullYear() === selectedYear);
  const filteredMileage = mileageEntries.filter(e => new Date(e.date).getFullYear() === selectedYear);
  const filteredEquipment = equipmentEntries.filter(e => new Date(e.date).getFullYear() === selectedYear);

  const totalMeals = filteredMeals.reduce((sum, entry) => sum + entry.deductible, 0);
  const totalMileage = filteredMileage.reduce((sum, entry) => sum + entry.allowance, 0);
  const totalEquipment = filteredEquipment.reduce((sum, entry) => sum + entry.deductibleAmount, 0);
  const grandTotal = totalMeals + totalMileage + totalEquipment;

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Summary
    csvContent += `ZUSAMMENFASSUNG (${selectedYear})\n`;
    csvContent += `Verpflegungsmehraufwand,${totalMeals.toFixed(2)}\n`;
    csvContent += `Fahrtkosten,${totalMileage.toFixed(2)}\n`;
    csvContent += `Arbeitsmittel,${totalEquipment.toFixed(2)}\n`;
    csvContent += `GESAMT,${grandTotal.toFixed(2)}\n\n`;

    // Meals
    csvContent += "VERPFLEGUNG\n";
    csvContent += "Datum,Start,Ende,Dauer,Pauschale,Erstattung AG,Absetzbar\n";
    filteredMeals.forEach(e => {
      csvContent += `${e.date},${e.startTime},${e.endTime},${e.duration.toFixed(1)},${e.rate},${e.employerExpenses},${e.deductible}\n`;
    });
    csvContent += "\n";

    // Mileage
    csvContent += "FAHRTKOSTEN\n";
    csvContent += "Datum,Strecke (einfach),Gesamtstrecke,Pauschale\n";
    filteredMileage.forEach(e => {
      csvContent += `${e.date},${e.distance},${e.totalKm},${e.allowance}\n`;
    });
    csvContent += "\n";

    // Equipment
    csvContent += "ARBEITSMITTEL\n";
    csvContent += "Datum,Gegenstand,Preis,Status,Absetzbar\n";
    filteredEquipment.forEach(e => {
      csvContent += `${e.date},${e.name},${e.price},${e.status},${e.deductibleAmount}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `steuer_export_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 py-8 container-custom">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Übersicht Ihrer steuerlichen Absetzungen für {selectedYear}.</p>
        </div>
        <button 
          onClick={downloadCSV}
          className="btn-primary"
        >
          Export CSV ({selectedYear})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-modern">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Verpflegung</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{totalMeals.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{filteredMeals.length} Einträge</p>
        </div>

        <div className="card-modern">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Fahrtkosten</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{totalMileage.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{filteredMileage.length} Fahrten</p>
        </div>

        <div className="card-modern">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Arbeitsmittel</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{totalEquipment.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{filteredEquipment.length} Gegenstände</p>
        </div>

        <div className="card-modern bg-primary/10 border-primary/20">
          <h3 className="text-sm font-medium text-primary uppercase tracking-wider">Gesamt Absetzbar</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">{grandTotal.toFixed(2)} €</span>
          </div>
          <p className="text-xs text-primary/70 mt-1">Steuerjahr {selectedYear}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-modern">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Schnellzugriff</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/meals" className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group">
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Abwesenheit erfassen</p>
                <p className="text-xs text-muted-foreground">Reisen & Verpflegung</p>
              </div>
              <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link href="/equipment" className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group">
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Arbeitsmittel hinzufügen</p>
                <p className="text-xs text-muted-foreground">Inventar & Abschreibungen</p>
              </div>
              <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
             <Link href="/settings" className="flex items-center p-3 rounded-lg bg-muted/30 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group">
              <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Einstellungen</p>
                <p className="text-xs text-muted-foreground">Pauschalen & Daten</p>
              </div>
              <svg className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="card-modern">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Letzte Aktivitäten</h3>
          {mealEntries.length === 0 && mileageEntries.length === 0 ? (
            <p className="text-muted-foreground text-sm">Keine Einträge vorhanden.</p>
          ) : (
            <div className="space-y-4">
              {mealEntries.slice(-3).reverse().map(entry => (
                <div key={entry.id} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">Verpflegung</p>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">+{entry.deductible.toFixed(2)} €</span>
                </div>
              ))}
               {mileageEntries.slice(-3).reverse().map(entry => (
                <div key={entry.id} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">Fahrt</p>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                  </div>
                  <span className="text-sm font-medium text-primary">+{entry.allowance.toFixed(2)} €</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
