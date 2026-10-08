import type { MemberInterface, CardMandat, Pole } from "../../../../shared/types/cards.js"
export class LanyCat implements MemberInterface {
    cardType = 'member' as const;
    health: number = 100;
    maxHealth: number = 100;
    attackName: string = "MIAOUUU";
    attackDescription: string = "LanyCat utilise son cri félin pour effrayer l'adversaire.";
    attackCost: number = 10;
    statusEffects: string[] = [];
    mandat: CardMandat = "SDI";
    name: string = "LanyCat";
    id: string = "lanycat";
    description: string = "Est ce un chat ou un humain ?"
    poles: Pole[] = ['presidence', 'prevention', "communication"];
    picture: string = "assets/images/cards/members/lanycat.png";

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