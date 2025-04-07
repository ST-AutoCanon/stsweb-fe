// import type { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'com.example.app',
//   appName: 'sukalpatech-website',
//   webDir: 'build'
// };

// export default config;
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'STS',
  webDir: 'build',
  server: {
    hostname: 'localhost',
    cleartext: true  // Allow non-https origin in development
  }
};

export default config;