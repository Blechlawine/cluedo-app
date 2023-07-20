import { SaveDataOutput } from "./validators";

export type ListResponse = GameData[];

export type SaveResponse = string;

export type GetResponse = GameData;

export type GameData = {
    id: string;
    name: string;
    timestamp: string;
    data: SaveDataOutput;
}