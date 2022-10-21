import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Go To Bikes',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      splashFullScreen: false,
      splashImmersive: true,
      useDialog: false
    }
  },
};

export default config;
