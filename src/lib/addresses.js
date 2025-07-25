"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTRACT_ADDRESSES = void 0;
exports.getMarketAddress = getMarketAddress;
exports.getRouterAddress = getRouterAddress;
exports.getContractAddresses = getContractAddresses;
const chains_1 = require("./chains");
// Pennysia contract addresses - deployed on Sonic Blaze Testnet
exports.CONTRACT_ADDRESSES = {
    [chains_1.ChainId.MAINNET]: {
    // Not supported in MVP
    },
    [chains_1.ChainId.SEPOLIA]: {
    // Not supported in MVP
    },
    [chains_1.ChainId.SONIC]: {
    // Not supported in MVP
    },
    [chains_1.ChainId.SONIC_BLAZE_TESTNET]: {
        market: '0x1b4C769a1E14C9dbB158da0b9E3e5A53826AA9F5',
        router: '0x91205B2C56bc078B5777Fc96919A6CA4f7BDc3C7',
    },
};
function getMarketAddress(chainId) {
    return exports.CONTRACT_ADDRESSES[chainId]?.market;
}
function getRouterAddress(chainId) {
    return exports.CONTRACT_ADDRESSES[chainId]?.router;
}
function getContractAddresses(chainId) {
    return exports.CONTRACT_ADDRESSES[chainId] || {};
}
//# sourceMappingURL=addresses.js.map