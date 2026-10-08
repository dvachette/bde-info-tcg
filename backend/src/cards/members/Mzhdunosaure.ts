import type { MemberInterface, CardMandat, Pole } from "../../../../shared/types/cards.js"
export class Mzhdunosaure implements MemberInterface {
    cardType = 'member' as const;
    health: number = 100;
    maxHealth: number = 100;
    attackName: string = "Mzhdunosaure Attack";
    attackDescription: string = "Mzhdunosaure uses its special ability to attack the opponent.";
    attackCost: number = 10;
    statusEffects: string[] = [];
    mandat: CardMandat = "MIB";
    name: string = "Mzhdunosaure";
    id: string = "mzhdunosaure";
    description: string = "A mysterious and powerful member of the team.";
    poles: Pole[] = ['communication'];
    picture: string = "assets/images/cards/members/mzhdunosaure.png";

    attack(other: MemberInterface): boolean {
        const attack_damage = 15; // Example damage value
        if (other.health <= 0) {
            return false; // Cannot attack a member with 0 or less health
        }
        other.health -= attack_damage;
        if (other.health < 0) {
            other.health = 0; // Ensure health doesn't go below 0
        }
        return true; // Attack was successful
    }
}