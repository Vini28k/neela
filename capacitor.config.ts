import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.neela.mentalweather',
  appName: 'Neela Mental Weather',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for heart rate monitors...",
        cancel: "Cancel",
        availableDevices: "Available devices",
        noDeviceFound: "No heart rate monitors found"
      }
    }
  }
};

export default config;