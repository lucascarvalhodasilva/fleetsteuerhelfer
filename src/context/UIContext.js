"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalStack, setModalStack] = useState([]);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const pushModal = useCallback((modalId) => {
    setModalStack(prev => [...prev, modalId]);
  }, []);

  const popModal = useCallback(() => {
    setModalStack(prev => prev.slice(0, -1));
  }, []);

  const removeModal = useCallback((modalId) => {
    setModalStack(prev => prev.filter(id => id !== modalId));
  }, []);

  const hasOpenModals = modalStack.length > 0;

  return (
    <UIContext.Provider value={{
      sidebarOpen,
      openSidebar,
      closeSidebar,
      modalStack,
      pushModal,
      popModal,
      removeModal,
      hasOpenModals
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within a UIProvider');
  }
  return context;
}
