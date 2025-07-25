'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';

interface PrivyWrapperProps {
  children: ReactNode;
}

export default function PrivyWrapper({ children }: PrivyWrapperProps) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!.toString()}
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        // Configure appearance to match our theme
        appearance: {
          theme: 'light',
          accentColor: '#3B82F6', // Blue-600 to match our design
        },
        // Configure supported login methods
        loginMethods: ['email', 'wallet', 'google', 'passkey'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}
