import type { DrawableBooster } from "./Booster.js";
import { StandardBooster } from "./StandardBooster.js";
export { StandardBooster } from "./StandardBooster.js";

const BOOSTERS: readonly DrawableBooster[] = [new StandardBooster()];

export const boosterPool: Readonly<Record<string, DrawableBooster>> = Object.fromEntries(
    BOOSTERS.map((booster: DrawableBooster) => [booster.id, booster]),
);