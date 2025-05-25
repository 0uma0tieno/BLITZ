
// Payout constants (in KES)
export const PAYOUT_FOOTMAN_LOCAL_DELIVERY_KES = 100; // Base payout for footman direct delivery
export const PAYOUT_FOOTMAN_CONSOLIDATION_KES = 20; // For successfully batching and handing over to a rider
export const PAYOUT_RIDER_DELIVERY_KES = 80; // Base payout for rider if not distance-based

// Company share
export const COMPANY_SHARE_PERCENTAGE = 0.20; // 20%

// Default store ID for MVP
export const DEFAULT_STORE_ID = 'store001';
export const DEFAULT_STORE_NAME = 'Blitz Demo Store';

// M-Pesa Information
export const COMPANY_MPESA_PAYBILL = '123456'; // Example Paybill

// Cost Calculation Parameters (KES)
export const UBER_ESTIMATE_BASE_KES = 50;
export const UBER_ESTIMATE_PER_KM_KES = 30;
export const BLITZ_DISCOUNT_PERCENTAGE = 0.15; // We are 15% cheaper
export const AGENT_PAYOUT_PERCENTAGE_OF_CUSTOMER_COST = 0.70; // Agent gets 70% of what customer pays (after discount)

// Urgency Payout Modifiers (used if no distance is provided)
export const URGENCY_PAYOUT_NORMAL_KES = 100;
export const URGENCY_PAYOUT_URGENT_KES = 120;
export const URGENCY_PAYOUT_ASAP_KES = 150;

// Bonus Constants
export const BONUS_TOP_PERFORMER_KES = 500;
export const LEADERBOARD_TOP_N_FOR_BONUS = 1; // e.g., Top 1 performer gets a bonus
