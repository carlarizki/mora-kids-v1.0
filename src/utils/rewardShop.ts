// Reward Shop persistence — Phase 1 (see mora-reward-shop-prd.md).
// Same device-local, no-backend-yet localStorage pattern as codingProgress.ts.
//
// NOTE: this deliberately spends from the existing account-level
// `progress.totalStars` pool (not a per-child balance) — ChildProfile.stars
// exists in the type but is unused/never updated anywhere in the app today,
// so building a real per-child ledger here would be a separate, larger
// refactor. Flagged in the PRD; account-level keeps Phase 1 shippable now.

import { FamilyReward } from '../types/game';
import { DEFAULT_FAMILY_REWARDS } from '../data/catalog';

const OWNED_COSMETICS_KEY = 'mora_owned_cosmetics';
const FAMILY_REWARDS_KEY = 'mora_family_rewards';

export function loadOwnedCosmetics(): string[] {
  try {
    const raw = localStorage.getItem(OWNED_COSMETICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOwnedCosmetics(ids: string[]): void {
  try {
    localStorage.setItem(OWNED_COSMETICS_KEY, JSON.stringify(ids));
  } catch {
    // Quota exceeded or storage unavailable — best-effort local cache only.
  }
}

export function loadFamilyRewards(): FamilyReward[] {
  try {
    const raw = localStorage.getItem(FAMILY_REWARDS_KEY);
    if (!raw) return [...DEFAULT_FAMILY_REWARDS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...DEFAULT_FAMILY_REWARDS];
  } catch {
    return [...DEFAULT_FAMILY_REWARDS];
  }
}

export function saveFamilyRewards(rewards: FamilyReward[]): void {
  try {
    localStorage.setItem(FAMILY_REWARDS_KEY, JSON.stringify(rewards));
  } catch {
    // ignore
  }
}
