import { Card } from "./Card";

export interface Deck {
    id: number;
    name: string;
    cards: Card[]; // Array of Card objects
}