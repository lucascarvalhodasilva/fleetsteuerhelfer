import React, { useEffect, useState, useRef } from 'react';
import { formatDate } from '@/utils/dateFormatter';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function TripList({ 
  filteredMealEntries, 
  mileageEntries, 
  handleDeleteEntry, 
  selectedYear, 
  setIsFullScreen, 
  highlightId, 
  handleViewReceipt,
  onEdit
}) {
  const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, entry: null });
  const [openSwipeId, setOpenSwipeId] = useState(null);
  const swipeState = useRef({ id: null, startX: 0, translateX: 0, dragging: false });
  
  useEffect(() => {
    if (highlightId) {
      const element = document.getElementById(`trip-row-${highlightId}`);
      const innerElement = document.getElementById(`swipe-inner-${highlightId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (innerElement) {
          innerElement.classList.add('transition-all', 'duration-300', 'ease-in-out');
          const flash = () => {
            innerElement.classList.add('scale-[1.02]');
            innerElement.classList.remove('bg-card');
            innerElement.classList.add('bg-[#18181c]');
            setTimeout(() => {
              innerElement.classList.remove('scale-[1.02]');
              innerElement.classList.remove('bg-[#18181c]');
              innerElement.classList.add('bg-card');
            }, 300);
          };
          
          flash();
          setTimeout(flash, 600);
        }
      }
    }
  }, [highlightId, filteredMealEntries]);

  const handlePointerDown = (e, id) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    swipeState.current = { id, startX: clientX, translateX: 0, dragging: true };
  };

  const handlePointerMove = (e) => {
    if (!swipeState.current.dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let delta = clientX - swipeState.current.startX;
    if (delta > 0) delta = 0;
    const maxSwipe = -actionsWidth;
    if (delta < maxSwipe) delta = maxSwipe;
    swipeState.current.translateX = delta;
    const el = document.getElementById(`swipe-inner-${swipeState.current.id}`);
    if (el) {
      el.style.transform = `translateX(${delta}px)`;
    }
  };

  const handlePointerUp = () => {
    if (!swipeState.current.dragging) return;
    const shouldOpen = swipeState.current.translateX < -(actionsWidth / 3);
    const id = swipeState.current.id;
    setOpenSwipeId(shouldOpen ? id : null);
    const el = document.getElementById(`swipe-inner-${id}`);
    if (el) {
      el.style.transform = `translateX(${shouldOpen ? -actionsWidth : 0}px)`;
    }
    swipeState.current = { id: null, startX: 0, translateX: 0, dragging: false };
  };

  useEffect(() => {
    const onPointerUp = () => handlePointerUp();
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);
    return () => {
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, []);

  const actionsWidth = 170;

  return (
    <div className="card-modern flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">Fahrtenbuch</h2>
        <button 
          onClick={() => setIsFullScreen(true)}
          className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          Vollbild
        </button>
      </div>

      <div className="space-y-3">
        {filteredMealEntries.length === 0 ? (
          <div className="text-sm text-muted-foreground py-8 text-center">Keine Einträge für {selectedYear} vorhanden.</div>
        ) : (
          filteredMealEntries.map(entry => {
            const isMultiDay = entry.endDate && entry.endDate !== entry.date;
            
            // Calculate totals (prioritize relatedMealId, fallback to date)
            const relatedMileage = mileageEntries.filter(m => m.relatedMealId === entry.id);
            const dayMileage = relatedMileage.length > 0
              ? relatedMileage
              : mileageEntries.filter(m => m.date === entry.date || m.date === entry.endDate);

            const tripTo = dayMileage.find(m => m.purpose && m.purpose.includes('Beginn'));
            const tripFrom = dayMileage.find(m => m.purpose && m.purpose.includes('Ende'));
            
            const amountTo = tripTo ? tripTo.allowance : 0;
            const amountFrom = tripFrom ? tripFrom.allowance : 0;
            
            // Find public transport entries for this trip
            const publicTransportEntries = dayMileage.filter(m => m.vehicleType === 'public_transport');
            const publicTransportSum = publicTransportEntries.reduce((sum, m) => sum + (m.allowance || 0), 0);
            
            const mileageSum = amountTo + amountFrom + publicTransportSum;
            const totalDeductible = entry.deductible + mileageSum;

            const isOpen = openSwipeId === entry.id;

            return (
              <div 
                key={entry.id}
                id={`trip-row-${entry.id}`}
                className="relative overflow-hidden bg-card border-b border-border last:border-b-0"
                onMouseDown={(e) => handlePointerDown(e, entry.id)}
                onTouchStart={(e) => handlePointerDown(e, entry.id)}
                onMouseMove={handlePointerMove}
                onTouchMove={handlePointerMove}
              >
                <div 
                  className="absolute top-0 right-0 h-full flex items-stretch z-0"
                  style={{ width: `${actionsWidth}px` }}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenSwipeId(null); onEdit && onEdit(entry); }}
                    className="w-1/2 bg-secondary text-foreground hover:bg-secondary/80 text-sm font-medium transition-colors"
                    aria-label="Eintrag bearbeiten"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setOpenSwipeId(null); 
                      setDeleteConfirmation({ isOpen: true, entry }); 
                    }}
                    className="w-1/2 bg-destructive text-destructive-foreground hover:bg-destructive/80 text-sm font-medium transition-colors"
                    aria-label="Eintrag löschen"
                  >
                    Löschen
                  </button>
                </div>

                <div
                  id={`swipe-inner-${entry.id}`}
                  className={`relative px-4 transition-transform duration-200 bg-card z-10 `}
                  onMouseUp={handlePointerUp}
                  onTouchEnd={handlePointerUp}
                >
                  <div className="h-16 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <div className="font-semibold text-foreground">{formatDate(entry.date)}</div>
                      {isMultiDay && <div className="text-xs text-muted-foreground">bis {formatDate(entry.endDate)}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="font-bold text-primary text-base">{totalDeductible.toFixed(2)} €</div>
                      {publicTransportEntries.some(m => m.receiptFileName) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const withReceipt = publicTransportEntries.find(m => m.receiptFileName);
                            if (withReceipt) handleViewReceipt(withReceipt.receiptFileName);
                          }}
                          className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1"
                          aria-label="Beleg ansehen"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Beleg
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, entry: null })}
        onConfirm={() => {
          if (deleteConfirmation.entry) {
            handleDeleteEntry(
              deleteConfirmation.entry.id, 
              deleteConfirmation.entry.date, 
              deleteConfirmation.entry.endDate
            );
          }
        }}
        title="Eintrag löschen"
        message={deleteConfirmation.entry ? `Möchten Sie den Eintrag vom ${formatDate(deleteConfirmation.entry.date)} wirklich löschen?` : ''}
      />
    </div>
  );
}
