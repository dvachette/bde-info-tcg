import { memberPool } from "../cards/index.js";
import { Booster } from "./Booster.js";

const STANDARD_CARD_COUNT: number = 3;

export class StandardBooster extends Booster {
    public constructor() {
        super({
            id: "standard",
            name: "Booster standard",
            description: "Trois membres tirés au hasard.",
            cardCount: STANDARD_CARD_COUNT,
            allowDupes: false,
            pool: Object.keys(memberPool),
        });
    }
}