'use client';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store";

import "@/styles/globals.css";
import "toastify-js/src/toastify.css";

import { GoogleOAuthProvider } from '@react-oauth/google';

import AxiosInterceptor from "@/components/AxiosInterceptor";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AxiosInterceptor />
          {children}
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  );
}
