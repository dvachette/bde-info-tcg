import type { MemberInterface, CardMandat, Pole } from "../../../../shared/types/cards.js"
export class DonaDouze implements MemberInterface {
    cardType: 'member' = 'member';
    health: number = 100;
    maxHealth: number = 100;
    attackName: string = "Super Tux";
    attackDescription: string = "Envoie un Tux géant pour écraser l'adversaire.";
    attackCost: number = 10;
    statusEffects: string[] = [];
    mandat: CardMandat = "SDI";
    name: string = "DonaDouze";
    id: string = "donadouze";
    description: string = "Immense propagandiste de Linux.";
    poles: Pole[] = ['tresorerie', 'prevention'];
    picture: string = "assets/images/cards/members/donadouze.png";

    attack(other: MemberInterface): boolean {
        const attack_damage = 20; // Example damage value
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