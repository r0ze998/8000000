import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shrine8000000.app',
  appName: '8000000',
  webDir: '../web/dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1F2937",
      showSpinner: false
    },
    LocalNotifications: {
      smallIcon: "ic_stat_shrine",
      iconColor: "#8B5CF6"
    },
    Geolocation: {
      permissions: {
        location: "To find nearby shrines and temples"
      }
    }
  }
};

export default config;