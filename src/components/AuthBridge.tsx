'use client'

import { useEffect } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useStore } from '@/store/useStore'
import { ethers } from 'ethers'
import { ChainId } from '@/lib/sdk-utils'

/**
 * AuthBridge component synchronizes Privy authentication with useStore state
 * This ensures that when users connect via Privy, the useStore state is updated
 * so that other components (like useLiquidity) can access the wallet connection
 */
export default function AuthBridge() {
  const { ready, authenticated, user } = usePrivy()
  const { wallets } = useWallets()
  
  // Add a simple log to verify the component is running
  console.log('AuthBridge: Component mounted/updated', {
    ready,
    authenticated,
    userExists: !!user,
    walletsCount: wallets.length
  })

  useEffect(() => {
    console.log('AuthBridge: Privy state changed', { 
      ready, 
      authenticated, 
      userExists: !!user,
      walletsCount: wallets.length,
      walletAddresses: wallets.map(w => w.address)
    })
    
    if (!ready) {
      console.log('AuthBridge: Privy not ready yet')
      return
    }

    // Check for wallet connection - either authenticated flag or wallets present
    if ((authenticated && wallets.length > 0) || (!authenticated && wallets.length > 0)) {
      console.log('AuthBridge: Wallet detected, syncing to useStore...', {
        authenticated,
        walletsCount: wallets.length,
        method: authenticated ? 'authenticated-flag' : 'wallet-fallback'
      })
      
      const wallet = wallets[0]
      const address = wallet.address
      
      // Get the Ethereum provider from the wallet
      wallet.getEthereumProvider().then(async (provider) => {
        try {
          console.log('AuthBridge: Got Ethereum provider, creating ethers provider...')
          
          // Create ethers provider and signer
          const ethersProvider = new ethers.BrowserProvider(provider)
          const signer = await ethersProvider.getSigner()
          const network = await ethersProvider.getNetwork()
          
          console.log('AuthBridge: Network info:', { chainId: network.chainId, name: network.name })
          
          // Map network chainId to our ChainId enum
          let mappedChainId: ChainId
          switch (Number(network.chainId)) {
            case 1:
              mappedChainId = ChainId.MAINNET
              break
            case 11155111:
              mappedChainId = ChainId.SEPOLIA
              break
            case 146:
              mappedChainId = ChainId.SONIC
              break
            case 57054:
              mappedChainId = ChainId.SONIC_BLAZE_TESTNET
              break
            default:
              console.warn('AuthBridge: Unknown chain ID, defaulting to Sonic Blaze Testnet')
              mappedChainId = ChainId.SONIC_BLAZE_TESTNET
          }
          
          // Update useStore with the wallet connection info
          useStore.setState({
            isConnected: true,
            address,
            provider: ethersProvider,
            signer,
            chainId: mappedChainId
          })
          
          console.log('AuthBridge: Successfully synced wallet to useStore:', {
            address,
            chainId: mappedChainId,
            isConnected: true
          })
          
        } catch (error) {
          console.error('AuthBridge: Error setting up ethers provider:', error)
        }
      }).catch((error) => {
        console.error('AuthBridge: Error getting Ethereum provider:', error)
      })
      
    } else {
      console.log('AuthBridge: User not authenticated, clearing useStore...')
      
      // Clear useStore when not authenticated
      useStore.setState({
        isConnected: false,
        address: null,
        provider: null,
        signer: null,
        chainId: null
      })
    }
  }, [ready, authenticated, wallets, user])

  // This component doesn't render anything, it just syncs state
  return null
}
