import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.culturalshrine.village',
  appName: '文化神社村',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  ios: {
    preferredContentMode: 'mobile',
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#d32f2f',
      showSpinner: false
    }
  }
};

export default config;
