'use client';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";

import "@/styles/globals.css";
import "toastify-js/src/toastify.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

import { useEffect } from "react";
import AxiosInterceptor from "@/components/AxiosInterceptor";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { SocketProvider } from "@/context/SocketContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'persist:root') {
        window.location.reload();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ConfirmProvider>
            <SocketProvider>
              <AxiosInterceptor />
              {children}
            </SocketProvider>
          </ConfirmProvider>
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}
