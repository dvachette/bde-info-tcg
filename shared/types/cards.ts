/**
 * @author Donatien Vachette
 * This file contains common interfaces for cards
 */

/**
 * @interface Card
 * @description This interface represents a card in the game. It contains properties such as name, id, description, poles, and picture.
 */
interface Card {
    name: string;
    id: string;
    description: string;
    poles: Pole[];
    picture: string;
    cardType: CardType;
}

/**
 * @interface PetInterface
 * @extends Card
 * @description This interface represents a pet card in the game. It extends the Card interface and adds properties specific to pets, such as ability, abilityName, and abilityDescription.
 */
export interface PetInterface extends Card {
    cardType: 'pet';
    ability: string;
    abilityName: string;
    abilityDescription: string;
}

/**
 * @interface MemberInterface
 * @extends Card
 * @description This interface represents a member card in the game. It extends the Card interface and adds properties specific to members, such as health, maxHealth, attack_name, attack_description, attack_cost, atack, and status_effects.
 */
export interface MemberInterface extends Card {
    cardType: 'member';
    health: number;
    maxHealth: number;
    attackName: string;
    attackDescription: string;
    attackCost: number;
    attack: string;
    statusEffects: string[];
    mandat: CardMandat;
}

/**
 * @interface ArenaInterface
 * @extends Card
 * @description This interface represents an arena card in the game. It extends the Card interface and adds a property for the background of the arena.
 */
export interface ArenaInterface extends Card {
    cardType: 'arena';
    background: string;
}

/**
 * @type Pole
 * @description This type represents the different poles that a card can belong to in the game. 
 */
export type Pole = 'tresorerie'
    | 'presidence'
    | 'communication'
    | 'secretariat'
    | 'evenementiel'
    | 'local'
    | 'actif'
    | 'implique'
    | 'superviseur'
    | 'culture'
    | 'pioux'
    | 'prevention'
    | 'suivi'
    | 'pls'
    | 'pet'
    | 'arena'

/**
 * @type CardType
 * @description This type represents the different types of cards in the game. 
 * It can be either 'pet', 'member', or 'arena'.
 * 
 */
export type CardType = 'pet' | 'member' | 'arena';

/**
 * @type AnyCard
 * @description This type represents any card in the game. It can be a PetInterface, MemberInterface, or ArenaInterface.
 */
export type AnyCard = PetInterface | MemberInterface | ArenaInterface;

/**
 * 
 */
export type CardMandat = 'FBI' | 'SDI' | 'SIB' | 'MIB' 