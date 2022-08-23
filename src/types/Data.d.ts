interface IPlayer {
    id: number;
    name: string;
    cardAmount: number;
}

interface ICard {
    id: string;
    name: string;
}

interface IGame {
    date: Date;
    players: IPlayer[];
    Cards: ICard[];
}