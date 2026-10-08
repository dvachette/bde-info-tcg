import { randomInt } from "node:crypto";
import type { BoosterInterface } from "../../../shared/types/boosters.js";
import { cardPool } from "../cards/index.js";

export interface DrawableBooster extends BoosterInterface {
    draw: () => string[];
}

export interface BoosterConfig {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly cardCount: number;
    readonly allowDupes: boolean;
    readonly pool: readonly string[];
}

export abstract class Booster implements DrawableBooster {
    public readonly id: string;
    public readonly name: string;
    public readonly description: string;
    public readonly cardCount: number;
    public readonly allowDupes: boolean;
    public readonly pool: readonly string[];

    protected constructor(config: BoosterConfig) {
        Booster.validate(config);
        this.id = config.id;
        this.name = config.name;
        this.description = config.description;
        this.cardCount = config.cardCount;
        this.allowDupes = config.allowDupes;
        this.pool = [...config.pool];
    }

    public draw(): string[] {
        return this.allowDupes ? this.drawWithDupes() : this.drawWithoutDupes();
    }

    protected drawWithDupes(): string[] {
        const drawn: string[] = [];
        for (let i: number = 0; i < this.cardCount; i++) {
            const cardId: string | undefined = this.pool[randomInt(this.pool.length)];
            if (cardId === undefined) {
                throw new Error(`Empty pool in booster ${this.id}`);
            }
            drawn.push(cardId);
        }
        return drawn;
    }

    protected drawWithoutDupes(): string[] {
        const remaining: string[] = [...this.pool];
        const drawn: string[] = [];
        for (let i: number = 0; i < this.cardCount; i++) {
            const [cardId] = remaining.splice(randomInt(remaining.length), 1);
            if (cardId === undefined) {
                throw new Error(`Pool too small in booster ${this.id}`);
            }
            drawn.push(cardId);
        }
        return drawn;
    }

    private static validate(config: BoosterConfig): void {
        if (!Number.isInteger(config.cardCount) || config.cardCount < 1) {
            throw new Error(`Booster ${config.id}: invalid cardCount`);
        }
        if (new Set(config.pool).size !== config.pool.length) {
            throw new Error(`Booster ${config.id}: duplicate cardId in pool`);
        }
        for (const cardId of config.pool) {
            if (!Object.hasOwn(cardPool, cardId)) {
                throw new Error(`Booster ${config.id}: unknown cardId ${cardId}`);
            }
        }
        if (config.pool.length === 0 || (!config.allowDupes && config.pool.length < config.cardCount)) {
            throw new Error(`Booster ${config.id}: pool too small`);
        }
    }
}