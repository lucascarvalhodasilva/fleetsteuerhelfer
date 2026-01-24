import React from 'react';
import { monthNames } from '../utils/tripCalculations';

/**
 * @typedef {Object} TripEntry
 * @property {string|Date} date - Date of the trip entry
 * @property {number} deductible - Deductible amount in euros
 */

/**
 * @typedef {Object} MileageEntry
 * @property {string|Date} date - Date of the mileage entry
 * @property {number} [allowance] - Mileage allowance amount in euros
 */

/**
 * @typedef {Object} MonthlyExpense
 * @property {number} month - Month index (0-11)
 * @property {string|number} year - Year of the expense
 * @property {number} amount - Expense amount in euros
 */

/**
 * @typedef {Object} BalanceSheetScrollerProps
 * @property {MonthlyExpense[]} filteredMonthlyExpenses - Filtered monthly expenses for the selected year
 * @property {TripEntry[]} tripEntries - Trip entries for the selected year
 * @property {MileageEntry[]} mileageEntries - All mileage entries
 * @property {string|number} selectedYear - Currently selected year
 * @property {Function} [handleClickWrapper] - Click handler for month selection
 * @property {Function} [handleMonthClick] - Alternative click handler for month selection
 */

/**
 * Horizontal scrollable balance sheet showing yearly and monthly financial summaries.
 * Displays income from allowances vs expenses, with monthly breakdown cards.
 */
export default function BalanceSheetScroller({ 
  filteredMonthlyExpenses, 
  tripEntries, 
  mileageEntries, 
  selectedYear, 
  handleClickWrapper, 
  handleMonthClick
}) {
  // Calculate Yearly Totals
  const totalIncome = tripEntries.reduce((sum, m) => sum + m.deductible, 0) + 
    mileageEntries
      .filter(m => new Date(m.date).getFullYear() === parseInt(selectedYear))
      .reduce((sum, m) => sum + (m.allowance || 0), 0);

  const totalExpenses = filteredMonthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const yearlyBalance = totalIncome - totalExpenses;
  const isYearlyPositive = yearlyBalance >= 0;

  // Calculate months with activity (trips or expenses)
  const activeMonths = new Set();
  
  tripEntries.forEach(m => {
    const d = new Date(m.date);
    if (d.getFullYear() === parseInt(selectedYear)) {
      activeMonths.add(d.getMonth());
    }
  });

  mileageEntries.forEach(m => {
    const d = new Date(m.date);
    if (d.getFullYear() === parseInt(selectedYear)) {
      activeMonths.add(d.getMonth());
    }
  });

  filteredMonthlyExpenses.forEach(e => {
    if (e.year === selectedYear) {
      activeMonths.add(e.month);
    }
  });

  const sortedMonths = Array.from(activeMonths).sort((a, b) => b - a);

  return (
    <div className="flex flex-col gap-4">
      {/* Header + Summary Box */}
      <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
        {/* Header with Glassmorphism */}
        <div className="relative p-6 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
                <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl"></div>
                <svg className="relative w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground mb-0.5">Jahresbilanz</h2>
                <p className="text-xs text-muted-foreground font-medium">{selectedYear}</p>
              </div>
            </div>
            
            {/* Yearly Balance Badge - Redesigned */}
                  <div className={`relative px-5 py-3 rounded-2xl backdrop-blur-sm `}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                    <span className="relative text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block text-right mb-1">Gesamt</span>
                    <span className={`relative text-2xl font-black bg-gradient-to-br ${
                    isYearlyPositive 
                      ? 'from-emerald-500 via-green-600 to-emerald-700 dark:from-emerald-400 dark:via-green-400 dark:to-emerald-500 bg-clip-text text-transparent' 
                      : 'text-red-600 dark:text-red-400'
                    }`}>
                    {yearlyBalance > 0 ? '+' : ''}{yearlyBalance.toFixed(2)}€
                    </span>
                  </div>
                  </div>

                  {/* Income vs Expenses Summary - Modernized */}
          <div className="relative flex items-stretch gap-4 p-4 rounded-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
            
            <div className="flex-1 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1">Pauschalen</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">+{totalIncome.toFixed(2)}€</span>
              </div>
            </div>
            
            <div className="w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
            
            <div className="flex-1 flex items-center justify-end gap-3">
              <div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold block mb-1 text-right">Spesen</span>
                <span className="text-lg font-black text-amber-600 dark:text-amber-400">−{totalExpenses.toFixed(2)}€</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Cards Scroller - Separate */}
      <div>
        <div 
          className="flex gap-4 overflow-x-auto pb-3 snap-x no-scrollbar" 
          style={{ 
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {sortedMonths.map(month => {
            const expense = filteredMonthlyExpenses.find(e => e.month === month);
            const expenseAmount = expense ? expense.amount : 0;
            
            const monthlyTrips = tripEntries
              .filter(m => new Date(m.date).getMonth() === month)
              .reduce((sum, m) => sum + m.deductible, 0);
              
            const monthlyMileage = mileageEntries
              .filter(m => {
                 const d = new Date(m.date);
                 return d.getFullYear() === parseInt(selectedYear) && d.getMonth() === month;
              })
              .reduce((sum, m) => sum + (m.allowance || 0), 0);
              
            const monthlyIncome = monthlyTrips + monthlyMileage;
            const balance = monthlyIncome - expenseAmount;
            const isPositive = balance >= 0;

            if (monthlyIncome === 0 && expenseAmount === 0) return null;

            return (
              <button 
                key={month}
                onClick={(e) => {
                  e.preventDefault();
                  if (handleClickWrapper) handleClickWrapper(month);
                  else if (handleMonthClick) handleMonthClick(month);
                }}
                className={`relative flex-none w-36 rounded-xl p-4 flex flex-col gap-3 snap-start text-left select-none overflow-hidden shadow-sm active:scale-95 transition-transform ${
                  isPositive 
                    ? 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30' 
                    : 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/30'
                }`}
              >


                {/* Month Header */}
                <div className="relative flex justify-between items-start w-full">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                      {monthNames[month]}
                    </span>
                  </div>
                  {expenseAmount > 0 && (
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/30 px-1.5 py-0.5 rounded">
                      −{expenseAmount.toFixed(0)}€
                    </span>
                  )}
                </div>

                {/* Income & Balance */}
                <div className="relative space-y-2">
                  {monthlyIncome > 0 && (
                    <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-emerald-500/5">
                      <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+{monthlyIncome.toFixed(2)}€</span>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-border/30">
                    <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Bilanz</span>
                    <span className={`text-lg font-black leading-none ${
                      isPositive 
                        ? 'text-emerald-600 dark:text-emerald-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {balance > 0 ? '+' : ''}{balance.toFixed(2)}€
                    </span>
                  </div>
                </div>


              </button>
            );
          })}
          
          {sortedMonths.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 w-full text-center">
              <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/10 flex items-center justify-center mb-4 shadow-inner">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent"></div>
                <svg className="relative w-10 h-10 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-muted-foreground mb-1">Keine Daten vorhanden</p>
              <p className="text-xs text-muted-foreground/60">Fügen Sie Reisen hinzu, um die Bilanz zu sehen</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}