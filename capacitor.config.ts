// import type { CapacitorConfig } from '@capacitor/cli';

// const config: CapacitorConfig = {
//   appId: 'com.example.app',
//   appName: 'sukalpatech-website',
//   webDir: 'build'
// };

// export default config;
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'MyApp',
  webDir: 'build',  // Ensure this points to your build folder
  bundledWebRuntime: false
};

export default config;
