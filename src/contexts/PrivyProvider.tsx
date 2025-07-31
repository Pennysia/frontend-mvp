'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReactNode } from 'react';
// Replace this with any of the networks listed at https://github.com/wevm/viem/blob/main/src/chains/index.ts
import {sonicBlazeTestnet} from 'viem/chains';

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
          logo: "https://auth.privy.io/logos/privy-logo.png",
          showWalletLoginFirst: false,
        },
        defaultChain: sonicBlazeTestnet,
        supportedChains: [sonicBlazeTestnet],
        // Configure supported login methods
        loginMethods: ['email', 'wallet', 'google', 'passkey'],
      }}
    >
      {children}
    </PrivyProvider>
  );
}



