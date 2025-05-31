import type { CapacitorConfig } from '@capacitor/cli';

// TestFlight用の本番設定

const config: CapacitorConfig = {
  appId: 'com.8000000.app',
  appName: '8000000',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  ios: {
    preferredContentMode: 'mobile',
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: false,
    handleApplicationNotifications: false,
    scheme: '8000000'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      iosSpinnerStyle: 'small',
      spinnerColor: '#FFD700'
    },
    StatusBar: {
      style: 'dark'
    },
    Camera: {
      permissions: ['camera']
    },
    Geolocation: {
      permissions: ['location']
    }
  }
};

export default config;
