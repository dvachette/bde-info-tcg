import type { MemberInterface, CardMandat, Pole } from "../../../../shared/types/cards.js"
export class Sulato implements MemberInterface {
    cardType = 'member' as const;
    health: number = 100;
    maxHealth: number = 100;
    attackName: string = "Infodcast";
    attackDescription: string = "Lance un podcast sur l'informatique pour distraire l'adversaire.";
    attackCost: number = 10;
    statusEffects: string[] = [];
    mandat: CardMandat = "SDI";
    name: string = "Sulato";
    id: string = "sulato";
    description: string = "Un passionné d'informatique et de technologie.";
    poles: Pole[] = ['communication'];
    picture: string = "assets/images/cards/members/sulato.png";

    attack(other: MemberInterface): boolean {
        const attack_damage = 12; // Example damage value
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