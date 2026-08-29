import { AnyCard, ArenaInterface, MemberInterface, PetInterface } from "../../../shared/types/cards.js";

import { DonaDouze } from "./members/DonaDouze.js";
export { DonaDouze } from "./members/DonaDouze.js";

import { LanyCat } from "./members/LanyCat.js";
export { LanyCat } from "./members/LanyCat.js";

import { Mzhdunosaure } from "./members/Mzhdunosaure.js";
export { Mzhdunosaure } from "./members/Mzhdunosaure.js";

import { Elise } from "./members/Elise.js";
export { Elise } from "./members/Elise.js";

import { Sulato } from "./members/Sulato.js";
export { Sulato } from "./members/Sulato.js";

export const memberPool: { [key: string]: MemberInterface } = {
    "donadouze": new DonaDouze(),
    "lanycat": new LanyCat(),
    "mzhdunosaure": new Mzhdunosaure(),
    "elise": new Elise(),
    "sulato": new Sulato(),

};

export const arenaPool: { [key: string]: ArenaInterface } = {

};

export const petPool: { [key: string]: PetInterface } = {

};

export const cardPool: { [key: string]: AnyCard } = {
    ...memberPool,
    ...arenaPool,
    ...petPool,
};