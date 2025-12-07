import React from 'react';

export default function MonthlySummary({ monthlyExpenses, monthNames }) {
  return (
    <div className="card-modern">
      <h2 className="text-lg font-semibold mb-4 text-foreground">Monatliche Übersicht</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-hide">
        {monthlyExpenses.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2">Keine Ausgaben in diesem Jahr.</div>
        ) : (
          monthlyExpenses.map(({ month, amount }) => (
            <div 
              key={month}
              className="flex-none w-32 h-20 rounded-lg border border-border bg-card p-3 flex flex-col justify-between snap-start shadow-sm"
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {monthNames[month]}
              </span>
              <span className="text-lg font-bold text-foreground">
                {amount.toFixed(2)} €
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
