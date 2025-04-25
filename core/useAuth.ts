import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync('tokens');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkLogin();
  }, []);

  return { isLoading, isLoggedIn };
}