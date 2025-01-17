import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GrCloud, GrRobot } from 'react-icons/gr';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { AZURE_AD_CLIENT_ID, AZURE_AD_TENANT_ID_URL } from '@/utils/app/const';

import '@/styles/globals.css';
import { useEffect, useState } from 'react';
import LoginComponent from '@/components/Auth/Login';


const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps<{}>) {
  const queryClient = new QueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(useIsAuthenticated());
  const [msalInstance, setMsalInstance] = useState<PublicClientApplication|null>(null);
  const { accounts } = useMsal();
  const handleLogin = () => {
    setIsAuthenticated(true);
  }

  useEffect(() => {
  const msalInstance = new PublicClientApplication({
    auth: {
        clientId: AZURE_AD_CLIENT_ID,
        authority: AZURE_AD_TENANT_ID_URL,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: "localStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
    });
    setMsalInstance(msalInstance);

    const account = msalInstance.getAllAccounts()[0]; // Aquí obtenemos la cuenta
    if (account) {
      setIsAuthenticated(true); // Si hay una cuenta, seteamos como autenticado
    }
  }, []);
  
  return (
    (msalInstance ?  <MsalProvider instance={msalInstance}>
      <div className={inter.className}>
        <Toaster />       
        <QueryClientProvider client={queryClient}>
          {isAuthenticated ? <Component {...pageProps} /> : <LoginComponent onLogin={handleLogin}/>}
        </QueryClientProvider>
      </div>
    </MsalProvider> : null)
   
  );
}

export default appWithTranslation(App);
