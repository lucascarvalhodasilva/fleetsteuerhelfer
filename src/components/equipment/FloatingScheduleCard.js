import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { DEFAULT_TAX_RATES } from '@/constants/taxRates';

export default function FloatingScheduleCard({ 
  equipment, 
  open, 
  onClose, 
  schedule,
  selectedYear,
  onViewReceipt 
}) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState(equipment);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Handle equipment change with smooth transition
  useEffect(() => {
    if (equipment && equipment.id !== currentEquipment?.id && open) {
      // Trigger transition
      setIsTransitioning(true);
      
      // After slide-down animation completes, update content
      setTimeout(() => {
        setCurrentEquipment(equipment);
        setIsTransitioning(false);
      }, 150); // Half of transition time for content swap
    } else if (equipment) {
      setCurrentEquipment(equipment);
    }
  }, [equipment, open]);
  
  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.deltaY > 0) {
        setDragY(eventData.deltaY);
        setIsDragging(true);
      }
    },
    onSwiped: (eventData) => {
      setIsDragging(false);
      if (eventData.deltaY > 50 || Math.abs(eventData.velocity) > 0.3) {
        onClose();
        setDragY(0);
      } else {
        setDragY(0);
      }
    },
    preventScrollOnSwipe: false,
    trackMouse: true,
    delta: 10
  });

  if (!open || !currentEquipment) return null;

  const currentSchedule = schedule || {};
  const isGWG = currentSchedule.type === 'GWG';
  const gwgLimit = DEFAULT_TAX_RATES.gwgLimit;
  // Calculate years from schedule data or default to 3
  const depreciationYears = currentSchedule.years?.length || 3;

  return (
    <div
      {...handlers}
      className={`fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/30 rounded-t-2xl p-6 z-[1200] overflow-y-auto transition-transform ${
        isDragging ? '' : 'duration-300 ease-in-out'
      }`}
      style={{
        maxHeight: '50vh',
        boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.15)',
        transform: `translateY(${open ? dragY : '100%'}px)`,
        pointerEvents: 'auto',
        animation: open && !isTransitioning ? 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
      }}
    >
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Drag Handle */}
      <div className="flex items-center justify-center mb-4">
        <div 
          className="w-10 h-1 bg-muted-foreground/30 rounded-full cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Content with fade transition */}
      <div 
        className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <span className="text-2xl">💻</span>
            {currentEquipment.name || 'Arbeitsmittel'}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center"
            aria-label="Schließen"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-px bg-border/30 mb-4" />

        {/* Equipment Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Kaufpreis</div>
            <div className="text-base font-bold text-foreground">
              €{parseFloat(currentEquipment.price || 0).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Nutzungsdauer</div>
            <div className="text-base font-bold text-foreground">
              {depreciationYears} {depreciationYears === 1 ? 'Jahr' : 'Jahre'}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-muted-foreground mb-1">GWG-Grenze (€{gwgLimit.toFixed(0)})</div>
            <div className={`text-base font-bold ${isGWG ? 'text-emerald-600' : 'text-foreground'}`}>
              {isGWG ? 'Ja - Sofortabschreibung' : 'Nein - Mehrjährig'}
            </div>
          </div>
        </div>

        {/* Depreciation Schedule */}
        {currentSchedule.years && currentSchedule.years.length > 0 && (
          <>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>📅</span>
              Abschreibungsplan
            </h4>
            <div className="bg-muted/20 rounded-xl p-4 mb-4">
              {currentSchedule.years.map((yearData, index) => (
                <div
                  key={yearData.year}
                  className={`flex items-center justify-between py-2 ${
                    index < currentSchedule.years.length - 1 ? 'border-b border-border/20' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-foreground">
                    {yearData.year}
                    {yearData.isCurrentYear && (
                      <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-blue-500 text-white font-semibold">
                        AKTUELL
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-semibold text-blue-600">
                    €{yearData.deduction.toFixed(2)}
                  </div>
                </div>
              ))}
              
              {/* Restwert */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t-2 border-border/30">
                <div className="text-sm font-bold text-foreground">Restwert</div>
                <div className="text-sm font-bold text-emerald-600">
                  €{currentSchedule.bookValue?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Receipt Preview */}
        {currentEquipment.receiptFileName && (
          <button
            onClick={() => onViewReceipt && onViewReceipt(currentEquipment.receiptFileName)}
            className="w-full py-3 px-4 rounded-xl border-2 border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-foreground"
          >
            <span>📄</span>
            Beleg anzeigen
          </button>
        )}
      </div>
    </div>
  );
}
