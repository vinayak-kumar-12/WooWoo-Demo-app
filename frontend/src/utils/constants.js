import { Platform } from 'react-native';

// For Android Emulator, localhost is 10.0.2.2. For iOS/Web, it is localhost.
// Replace with your local machine's IP (e.g. 192.168.x.x) if testing on a physical device.
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const constants = {
  API_URL: `${BASE_URL}/api`,
  TOKEN_KEY: 'WOOWOO_AUTH_TOKEN',
  REFRESH_TOKEN_KEY: 'WOOWOO_REFRESH_TOKEN',
  USER_KEY: 'WOOWOO_USER_DATA',
};
