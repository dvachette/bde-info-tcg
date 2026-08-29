import { cardPool } from "#cards/index.js";

export function openBoosterPack(allowRepeats: boolean = false): string[] {
    const cardPoolKeys = Object.keys(cardPool);
    const selectedCards: string[] = [];

    while (selectedCards.length < 5) {
        const randomIndex = Math.floor(Math.random() * cardPoolKeys.length);
        const selectedCardKey = cardPoolKeys[randomIndex];

        if (allowRepeats || !selectedCards.includes(selectedCardKey)) {
            selectedCards.push(selectedCardKey);
        }
    }

    return selectedCards;
}