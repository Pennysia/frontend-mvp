// Temporary SDK utilities to resolve Turbopack module resolution issues
// This file contains the essential exports from pennysia-sdk that are needed by the frontend

export enum ChainId {
  MAINNET = 1,
  SEPOLIA = 11155111,
  SONIC = 146,
  SONIC_BLAZE_TESTNET = 57054,
}

export interface ContractAddresses {
  market?: string
  router?: string
}

// Pennysia contract addresses - deployed on Sonic Blaze Testnet
export const CONTRACT_ADDRESSES: Record<ChainId, ContractAddresses> = {
  [ChainId.MAINNET]: {
    // Not supported in MVP
  },
  [ChainId.SEPOLIA]: {
    // Not supported in MVP
  },
  [ChainId.SONIC]: {
    // Not supported in MVP
  },
  [ChainId.SONIC_BLAZE_TESTNET]: {
    market: '0xe3b11A98E34aA76e3F03F45dF63cce75C7ECcBdf',
    router: '0x5D22f0B1190268bA6f0da8e2b36523983dd4b1ae',
  },
}

export function getMarketAddress(chainId: ChainId): string | undefined {
  return CONTRACT_ADDRESSES[chainId]?.market
}

export function getRouterAddress(chainId: ChainId): string | undefined {
  return CONTRACT_ADDRESSES[chainId]?.router
}

export function getContractAddresses(chainId: ChainId): ContractAddresses {
  return CONTRACT_ADDRESSES[chainId] || {}
}
