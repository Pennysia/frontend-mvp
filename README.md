# Pennysia AMM Frontend

A beautiful, modern frontend for the Pennysia directional AMM protocol built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or compatible Web3 wallet
- Access to Sonic Blaze Testnet

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌐 Network Setup

### Add Sonic Blaze Testnet to MetaMask

**Network Details:**
- **Network Name**: Sonic Blaze Testnet
- **RPC URL**: `https://rpc.blaze.soniclabs.com`
- **Chain ID**: `57054`
- **Currency Symbol**: `S`
- **Block Explorer**: `https://explorer.blaze.soniclabs.com`

### Deployed Contracts
- **Market Contract**: `0x1b4C769a1E14C9dbB158da0b9E3e5A53826AA9F5`
- **Router Contract**: `0x91205B2C56bc078B5777Fc96919A6CA4f7BDc3C7`

## ✨ Features

### 🎯 Directional Trading
- **Long Positions**: Bet on price increases
- **Short Positions**: Bet on price decreases
- **Real-time Price Impact**: Live calculations using Pennysia AMM math
- **Slippage Protection**: Configurable tolerance settings

### 💰 Advanced AMM Mechanics
- **Directional Liquidity**: Separate reserves for long/short positions
- **0.3% Protocol Fee**: Consistent across all operations
- **Price Impact Warnings**: Visual alerts for high-impact trades
- **Multi-directional LP Tokens**: Support for complex liquidity positions

### 🎨 Modern UI/UX
- **Dark Theme**: Professional trading interface
- **Responsive Design**: Works on all devices
- **Real-time Updates**: Live price and balance updates
- **Toast Notifications**: User-friendly error and success messages
- **Glass Morphism**: Modern visual effects

## 🔧 Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Web3 Integration**: Ethers.js v6
- **UI Components**: Headless UI + Heroicons
- **SDK**: Custom Pennysia SDK

## 🏗️ Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with providers
│   └── page.tsx        # Main trading interface
├── components/         # React components
│   ├── Header.tsx      # Navigation and wallet connection
│   └── SwapInterface.tsx # Main trading interface
└── store/              # State management
    └── useStore.ts     # Zustand store with wallet logic
```

## 🎮 Usage

### Connect Wallet
1. Click "Connect Wallet" in the header
2. Approve the connection in MetaMask
3. Ensure you're on Sonic Blaze Testnet (Chain ID: 57054)

### Make a Trade
1. Select your position type (Long/Short)
2. Enter the amount you want to trade
3. Review price impact and slippage
4. Click "Swap" to execute the trade
5. Confirm the transaction in MetaMask

### Adjust Settings
1. Click the settings icon (⚙️) in the swap interface
2. Adjust slippage tolerance (default: 0.5%)
3. Settings are saved automatically

## 🔍 Monitoring

- **Market Overview**: Real-time volume and liquidity stats
- **Recent Trades**: Live feed of protocol activity
- **Your Positions**: Track your active trades (when connected)
- **Top Pools**: Most active liquidity pools

## 🚨 Important Notes

- **Testnet Only**: This is deployed on Sonic Blaze Testnet for testing
- **No Real Value**: Testnet tokens have no monetary value
- **MVP Version**: Limited to core trading functionality
- **Single Chain**: Only Sonic Blaze Testnet is supported

## 🔗 Links

- **Sonic Blaze Explorer**: https://explorer.blaze.soniclabs.com
- **Market Contract**: https://explorer.blaze.soniclabs.com/address/0x1b4C769a1E14C9dbB158da0b9E3e5A53826AA9F5
- **Router Contract**: https://explorer.blaze.soniclabs.com/address/0x91205B2C56bc078B5777Fc96919A6CA4f7BDc3C7

## 🛠️ Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📝 License

MIT License - see LICENSE file for details.
