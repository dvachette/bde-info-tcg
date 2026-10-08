import type { MemberInterface, CardMandat, Pole } from "../../../../shared/types/cards.js"
export class Elise implements MemberInterface {
    cardType = 'member' as const;
    health: number = 100;
    maxHealth: number = 100;
    attackName: string = "Elise's Attack";
    attackDescription: string = "Elise uses her special ability to attack the opponent.";
    attackCost: number = 10;
    statusEffects: string[] = [];
    mandat: CardMandat = "SDI";
    name: string = "Elise";
    id: string = "elise";
    description: string = "A skilled member of the team with unique abilities.";
    poles: Pole[] = ['communication', 'culture'];
    picture: string = "assets/images/cards/members/elise.png";

    attack(other: MemberInterface): boolean {
        const attack_damage = 18; // Example damage value
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

