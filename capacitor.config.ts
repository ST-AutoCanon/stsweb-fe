
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'STS',
  webDir: 'build',
  server: {
    hostname: 'localhost',
    cleartext: true  
  }
};

export default config;