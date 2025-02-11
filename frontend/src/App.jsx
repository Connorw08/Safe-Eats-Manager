import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';
module.exports = {
  extends: ['react-app'],
  rules: {
    // Add any custom rules here
  }
};
// Initialize Capacitor plugins
if (Capacitor.isNativePlatform()) {
  // Set status bar style
  StatusBar.setStyle({ style: 'dark' });
  
  // Handle back button
  CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      CapacitorApp.exitApp();
    } else {
      window.history.back();
    }
  });
}