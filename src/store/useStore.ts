import { create } from 'zustand'
import { ethers } from 'ethers'
import { 
  PennysiaSDK, 
  ChainId, 
  Token, 
  PennysiaPair,
  getChainInfoWithRpc,
  NATIVE_CURRENCY,
  WETH
} from '@/lib/index'

export interface AppState {
  // Wallet connection
  isConnected: boolean
  address: string | null
  provider: ethers.BrowserProvider | null
  signer: ethers.JsonRpcSigner | null
  chainId: ChainId | null
  
  // SDK instance
  sdk: PennysiaSDK | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Trading state
  selectedTokenA: Token | null
  selectedTokenB: Token | null
  currentPair: PennysiaPair | null
  isLongPosition: boolean
  
  // Actions
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchChain: (chainId: ChainId) => Promise<void>
  setTokens: (tokenA: Token, tokenB: Token) => void
  setPositionType: (isLong: boolean) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  isConnected: false,
  address: null,
  provider: null,
  signer: null,
  chainId: null,
  sdk: null,
  isLoading: false,
  error: null,
  selectedTokenA: null,
  selectedTokenB: null,
  currentPair: null,
  isLongPosition: true,

  // Connect wallet action
  connectWallet: async () => {
    try {
      set({ isLoading: true, error: null })
      
      if (!window.ethereum?.request) {
        throw new Error('Please install MetaMask or another Web3 wallet')
      }

      // Request account access
      await (window.ethereum as any).request({ method: 'eth_requestAccounts' })
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum as any)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()
      const chainId = Number(network.chainId) as ChainId

      // Validate supported chain (MVP only supports Sonic Blaze Testnet)
      if (chainId !== ChainId.SONIC_BLAZE_TESTNET) {
        throw new Error(`Unsupported chain. Please switch to Sonic Blaze Testnet (Chain ID: ${ChainId.SONIC_BLAZE_TESTNET}).`)
      }

      // Create SDK instance
      const rpcUrl = getRpcUrl(chainId)
      const rpcProvider = new ethers.JsonRpcProvider(rpcUrl)
      const sdk = PennysiaSDK.create(chainId, rpcProvider, signer)

      // Set default tokens
      const nativeCurrency = NATIVE_CURRENCY[chainId]
      const weth = WETH[chainId]

      set({
        isConnected: true,
        address,
        provider,
        signer,
        chainId,
        sdk,
        selectedTokenA: nativeCurrency,
        selectedTokenB: weth,
        isLoading: false
      })

      // Listen for account changes
      if (window.ethereum?.on) {
        (window.ethereum as any).on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            get().disconnectWallet()
          } else {
            get().connectWallet()
          }
        })

        // Listen for chain changes
        (window.ethereum as any).on('chainChanged', () => {
          get().connectWallet()
        })
      }

    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to connect wallet',
        isLoading: false
      })
    }
  },

  // Disconnect wallet action
  disconnectWallet: async () => {
    try {
      // Clear app state first
      set({
        isConnected: false,
        address: null,
        provider: null,
        signer: null,
        chainId: null,
        sdk: null,
        selectedTokenA: null,
        selectedTokenB: null,
        currentPair: null
      })
      
      // If MetaMask is available, request account disconnection
      if (typeof window !== 'undefined' && window.ethereum?.request) {
        // Note: MetaMask doesn't have a direct disconnect method
        // The user needs to manually disconnect from MetaMask UI
        // But we can clear any cached permissions
        try {
          // Request permissions to potentially reset the connection state
          await (window.ethereum as any).request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          })
        } catch (error) {
          // User cancelled or other error - this is expected behavior
          console.log('Wallet disconnect completed')
        }
      }
    } catch (error) {
      console.error('Error during wallet disconnect:', error)
      // Still clear the state even if there's an error
      set({
        isConnected: false,
        address: null,
        provider: null,
        signer: null,
        chainId: null,
        sdk: null,
        selectedTokenA: null,
        selectedTokenB: null,
        currentPair: null
      })
    }
  },

  // Switch chain action
  switchChain: async (targetChainId: ChainId) => {
    try {
      set({ isLoading: true, error: null })
      
      if (!window.ethereum?.request) {
        throw new Error('MetaMask not available')
      }

      const chainHex = `0x${targetChainId.toString(16)}`
      
      await (window.ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainHex }],
      })
      
      // Reconnect with new chain
      await get().connectWallet()
      
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added to wallet, add it
        try {
          if (!window.ethereum?.request) {
            throw new Error('MetaMask not available')
          }
          
          const chainInfo = getChainInfo(targetChainId)
          await (window.ethereum as any).request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: chainInfo.name,
              nativeCurrency: {
                name: chainInfo.nativeCurrency.name,
                symbol: chainInfo.nativeCurrency.symbol,
                decimals: chainInfo.nativeCurrency.decimals,
              },
              rpcUrls: chainInfo.rpcUrls,
              blockExplorerUrls: chainInfo.blockExplorerUrls,
            }],
          })
          await get().connectWallet()
        } catch (addError: any) {
          set({ 
            error: `Failed to add chain: ${addError.message}`,
            isLoading: false
          })
        }
      } else {
        set({ 
          error: `Failed to switch chain: ${error.message}`,
          isLoading: false
        })
      }
    }
  },

  // Set selected tokens
  setTokens: (tokenA: Token, tokenB: Token) => {
    set({ 
      selectedTokenA: tokenA, 
      selectedTokenB: tokenB,
      currentPair: null // Reset pair when tokens change
    })
  },

  // Set position type (long/short)
  setPositionType: (isLong: boolean) => {
    set({ isLongPosition: isLong })
  },

  // Set error
  setError: (error: string | null) => {
    set({ error })
  },

  // Set loading
  setLoading: (loading: boolean) => {
    set({ isLoading: loading })
  }
}))

// Helper function to get RPC URL for chain
function getRpcUrl(chainId: ChainId): string {
  switch (chainId) {
    case ChainId.MAINNET:
      return process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || 'https://eth.llamarpc.com'
    case ChainId.SEPOLIA:
      return process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'
    case ChainId.SONIC:
      return 'https://rpc.soniclabs.com'
    case ChainId.SONIC_BLAZE_TESTNET:
      return 'https://rpc.blaze.soniclabs.com'
    default:
      return 'https://eth.llamarpc.com'
  }
}

// Helper function to get chain info
function getChainInfo(chainId: ChainId) {
  const chainInfoMap = {
    [ChainId.MAINNET]: {
      name: 'Ethereum Mainnet',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://eth.llamarpc.com'],
      blockExplorerUrls: ['https://etherscan.io'],
    },
    [ChainId.SEPOLIA]: {
      name: 'Sepolia Testnet',
      nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
      rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
      blockExplorerUrls: ['https://sepolia.etherscan.io'],
    },
    [ChainId.SONIC]: {
      name: 'Sonic Mainnet',
      nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
      rpcUrls: ['https://rpc.soniclabs.com'],
      blockExplorerUrls: ['https://explorer.soniclabs.com'],
    },
    [ChainId.SONIC_BLAZE_TESTNET]: {
      name: 'Sonic Blaze Testnet',
      nativeCurrency: { name: 'Sonic', symbol: 'S', decimals: 18 },
      rpcUrls: ['https://rpc.blaze.soniclabs.com'],
      blockExplorerUrls: ['https://explorer.blaze.soniclabs.com'],
    },
  }
  
  return chainInfoMap[chainId]
}

// Note: Using type assertions for window.ethereum instead of global interface
// to avoid conflicts with existing type definitions
