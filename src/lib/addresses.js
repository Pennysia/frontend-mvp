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
        market: '0xe3b11A98E34aA76e3F03F45dF63cce75C7ECcBdf',
        router: '0x5D22f0B1190268bA6f0da8e2b36523983dd4b1ae',
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