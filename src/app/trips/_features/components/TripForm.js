import React, { useEffect, useRef, useState } from 'react';
import NumberInput from '@/components/NumberInput';
import CustomDatePicker from '@/components/CustomDatePicker';
import CustomTimePicker from '@/components/CustomTimePicker';
import { CameraSource } from '@capacitor/camera';

export default function TripForm({ 
  formData, 
  setFormData, 
  handleSubmit, 
  submitError,
  editingId,
  cancelEdit,
  hasChanges,
  tempPublicTransportReceipt,
  showPublicTransportCameraOptions,
  setShowPublicTransportCameraOptions,
  takePublicTransportPicture,
  removePublicTransportReceipt
}) {
  const formRef = useRef(null);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (editingId && formRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [editingId]);

  return (
    <div 
      className={`card-modern transition-all duration-1000 ${isFlashing ? 'ring-2 ring-primary shadow-lg shadow-primary/20' : ''}`} 
      ref={formRef}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          {editingId ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}
        </h2>
        {editingId && (
          <button 
            type="button"
            onClick={cancelEdit}
            className="text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-full transition-colors"
          >
            Abbrechen
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section: Reisezeitraum */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">Reisezeitraum</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Start</label>
              <CustomDatePicker
                className="input-modern text-sm"
                value={formData.date}
                onChange={e => {
                  const newDate = e.target.value;
                  if (!formData.endDate || formData.endDate < newDate) {
                    setFormData({...formData, date: newDate, endDate: newDate});
                  } else {
                    setFormData({...formData, date: newDate});
                  }
                }}
              />
              <CustomTimePicker
                className="input-modern text-sm"
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ende</label>
              <CustomDatePicker
                className="input-modern text-sm"
                min={formData.date}
                value={formData.endDate || formData.date}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
              <CustomTimePicker
                className="input-modern text-sm"
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Section: Verkehrsmittel */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">Verkehrsmittel</h3>
          
          {/* Toggle Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {['car', 'motorcycle', 'bike', 'public_transport'].map(mode => {
              const labels = { car: 'Auto', motorcycle: 'Motorrad', bike: 'Fahrrad', public_transport: 'Andere' };
              const isActive = formData.commute[mode].active;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      commute: {
                        ...prev.commute,
                        [mode]: { ...prev.commute[mode], active: !isActive }
                      }
                    }));
                  }}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1 ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-primary' 
                      : 'bg-card hover:bg-secondary border-border text-muted-foreground'
                  }`}
                >
                  <span>{labels[mode]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Inputs */}
          <div className="space-y-3 mt-2">
            {/* Car Slider */}
            {formData.commute.car.active && (
              <div className="space-y-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Auto (Hin & Zurück)</span>
                  <span>{(formData.commute.car.distance * 2).toFixed(1)} km</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="0.1"
                  value={formData.commute.car.distance * 2}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) / 2;
                    setFormData(prev => ({
                      ...prev,
                      commute: { ...prev.commute, car: { ...prev.commute.car, distance: val } }
                    }));
                  }}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}

            {/* Motorcycle Slider */}
            {formData.commute.motorcycle.active && (
              <div className="space-y-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Motorrad (Hin & Zurück)</span>
                  <span>{(formData.commute.motorcycle.distance * 2).toFixed(1)} km</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="0.1"
                  value={formData.commute.motorcycle.distance * 2}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) / 2;
                    setFormData(prev => ({
                      ...prev,
                      commute: { ...prev.commute, motorcycle: { ...prev.commute.motorcycle, distance: val } }
                    }));
                  }}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}

            {/* Bike Slider */}
            {formData.commute.bike.active && (
              <div className="space-y-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Fahrrad (Hin & Zurück)</span>
                  <span>{(formData.commute.bike.distance * 2).toFixed(1)} km</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="30" 
                  step="0.1"
                  value={formData.commute.bike.distance * 2}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) / 2;
                    setFormData(prev => ({
                      ...prev,
                      commute: { ...prev.commute, bike: { ...prev.commute.bike, distance: val } }
                    }));
                  }}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            )}

            {/* Public Transport Input */}
            {formData.commute.public_transport.active && (
              <div className="space-y-2 p-3 bg-secondary/30 rounded-lg border border-border/50">
                <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Kosten (Gesamt)</label>
                <NumberInput
                  className="input-modern text-sm bg-card"
                  value={formData.commute.public_transport.cost}
                  step="0.01"
                  onChange={e => {
                    const val = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      commute: { ...prev.commute, public_transport: { ...prev.commute.public_transport, cost: val } }
                    }));
                  }}
                  placeholder="0.00"
                />
                <p className="text-[10px] text-muted-foreground">Für Taxi, Uber, Roller, Bahn, Bus oder andere Tickets/Kosten.</p>

                {/* Receipt Upload Section */}
                <div className="pt-2">
                  <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-2">Beleg</label>
                  <button 
                    type="button" 
                    onClick={() => setShowPublicTransportCameraOptions(true)} 
                    className="w-full py-2.5 rounded-lg border border-dashed border-border hover:border-primary hover:bg-secondary/50 text-muted-foreground hover:text-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Beleg hinzufügen
                  </button>
                  {tempPublicTransportReceipt && (
                    <div className="relative w-24 h-24 mt-2 group">
                      <img 
                        src={`data:image/jpeg;base64,${tempPublicTransportReceipt}`} 
                        alt="Beleg Vorschau" 
                        className="w-full h-full object-cover rounded-lg border border-border shadow-sm"
                      />
                      <button 
                        type="button" 
                        onClick={removePublicTransportReceipt}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-destructive/90 transition-colors"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={editingId && !hasChanges}
          className={`w-full btn-primary py-3 mt-4 shadow-lg shadow-primary/20 ${editingId && !hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {editingId ? 'Aktualisieren' : 'Hinzufügen'}
        </button>
        
        {submitError && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive animate-in fade-in slide-in-from-top-2">
            {submitError}
          </div>
        )}
      </form>

      {/* Camera Options Modal */}
      {showPublicTransportCameraOptions && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Beleg hinzufügen</h3>
            <div className="space-y-3">
              <button
                onClick={() => takePublicTransportPicture && takePublicTransportPicture(CameraSource.Camera)}
                className="w-full p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-border flex items-center gap-3 transition-all"
              >
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">Kamera</span>
              </button>
              <button
                onClick={() => takePublicTransportPicture && takePublicTransportPicture(CameraSource.Photos)}
                className="w-full p-4 rounded-lg bg-secondary/50 hover:bg-secondary border border-border flex items-center gap-3 transition-all"
              >
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Galerie</span>
              </button>
              <button
                onClick={() => setShowPublicTransportCameraOptions(false)}
                className="w-full p-3 rounded-lg text-muted-foreground hover:bg-secondary/50 transition-colors mt-2"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
