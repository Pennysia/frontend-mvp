"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PENNYSIA_CONSTANTS = void 0;
exports.calculateMinimumAmount = calculateMinimumAmount;
exports.calculateMaximumAmount = calculateMaximumAmount;
exports.createDeadline = createDeadline;
exports.formatTokenAmount = formatTokenAmount;
exports.parseTokenAmount = parseTokenAmount;
// Common constants for Pennysia protocol
exports.PENNYSIA_CONSTANTS = {
    // Fee constants
    FEE_NUMERATOR: 3,
    FEE_DENOMINATOR: 1000,
    FEE_PERCENTAGE: 0.3,
    // Minimum values
    MINIMUM_LIQUIDITY: 1000,
    // Deadline defaults (in seconds)
    DEFAULT_DEADLINE_MINUTES: 20,
    DEFAULT_DEADLINE_SECONDS: 20 * 60,
    // Slippage defaults (in basis points)
    DEFAULT_SLIPPAGE_BPS: 50, // 0.5%
    HIGH_SLIPPAGE_BPS: 300, // 3%
    // Gas limits (estimated)
    GAS_LIMITS: {
        SWAP: 200000,
        ADD_LIQUIDITY: 300000,
        REMOVE_LIQUIDITY: 250000,
        APPROVE: 50000,
    },
    // Common addresses
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
    DEAD_ADDRESS: '0x000000000000000000000000000000000000dEaD',
    MARKET_ADDRESS: '0x1b4C769a1E14C9dbB158da0b9E3e5A53826AA9F5',
    ROUTER_ADDRESS: '0x91205B2C56bc078B5777Fc96919A6CA4f7BDc3C7', // TODO: Replace with actual Router contract address
    // Precision
    PRECISION_DECIMALS: 18,
    MAX_UINT256: '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
};
// Slippage helper functions
function calculateMinimumAmount(amount, slippageBps) {
    const amountBig = BigInt(amount);
    const slippageMultiplier = BigInt(10000 - slippageBps);
    return (amountBig * slippageMultiplier / BigInt(10000)).toString();
}
function calculateMaximumAmount(amount, slippageBps) {
    const amountBig = BigInt(amount);
    const slippageMultiplier = BigInt(10000 + slippageBps);
    return (amountBig * slippageMultiplier / BigInt(10000)).toString();
}
// Deadline helper
function createDeadline(minutesFromNow = exports.PENNYSIA_CONSTANTS.DEFAULT_DEADLINE_MINUTES) {
    return Math.floor(Date.now() / 1000) + (minutesFromNow * 60);
}
// Format helpers
function formatTokenAmount(amount, decimals) {
    const divisor = BigInt(10 ** decimals);
    const amountBig = BigInt(amount);
    const whole = amountBig / divisor;
    const fraction = amountBig % divisor;
    if (fraction === BigInt(0)) {
        return whole.toString();
    }
    const fractionStr = fraction.toString().padStart(decimals, '0').replace(/0+$/, '');
    return `${whole}.${fractionStr}`;
}
function parseTokenAmount(amount, decimals) {
    const [whole, fraction = ''] = amount.split('.');
    const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals);
    return (BigInt(whole) * BigInt(10 ** decimals) + BigInt(paddedFraction || 0)).toString();
}
//# sourceMappingURL=constants.js.map