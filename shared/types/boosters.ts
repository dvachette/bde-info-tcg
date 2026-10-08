/**
 * @interface BoosterInterface
 * @description Métadonnées d'un booster. Sérialisable : utilisable par le frontend.
 */
export interface BoosterInterface {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly cardCount: number;
    readonly allowDupes: boolean;
    readonly pool: readonly string[];
}