let accessToken: string | null = null;
let tokenListener: ((token: string | null) => void) | null = null;

// Helper to notify the listener if it exists
const notifyListener = () => {
  if (tokenListener) {
    tokenListener(accessToken);
  }
};

export const setAccessToken = (token: string): void => {
  accessToken = token;
  notifyListener();
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

export const clearAccessToken = (): void => {
  accessToken = null;
  notifyListener();
}; 

// Allows AuthProvider to subscribe to out-of-react token changes
export const onTokenChange = (callback: (token: string | null) => void): (() => void) => {
  tokenListener = callback;
  
  // Return a cleanup function to unsubscribe
  return () => {
    tokenListener = null;
  };
};