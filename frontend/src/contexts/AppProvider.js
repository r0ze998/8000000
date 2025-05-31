import React from 'react';
import { NotificationProvider } from './NotificationContext';
import { PlayerProvider } from './PlayerContext';
import { VisitProvider } from './VisitContext';
import { UIProvider } from './UIContext';

export const AppProvider = ({ children }) => {
  return (
    <NotificationProvider>
      <PlayerProvider>
        <VisitProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </VisitProvider>
      </PlayerProvider>
    </NotificationProvider>
  );
};