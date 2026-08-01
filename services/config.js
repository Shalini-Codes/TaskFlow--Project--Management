/* ==========================================================================
   TaskFlow Application Environment Configuration Reader
   ========================================================================== */

const getEnvVar = (key) => {
  if (typeof window !== 'undefined' && window.env && window.env[key]) {
    return window.env[key];
  }
  return '';
};

export const config = {
  firebase: {
    apiKey: getEnvVar('FIREBASE_API_KEY'),
    authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('FIREBASE_APP_ID')
  }
};
