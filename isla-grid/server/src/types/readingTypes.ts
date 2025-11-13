

import { Metatype } from "./metatypes.js";


export type Reading = Metatype &  {
    readingId: string;
    communityId: string;
    energyProduction:  number;
    energyRate: number; 
    dateStart: number; 
    dateEnd: number; 
    pesoEquivalent: number; 
    distribution: {
        id: string;
        name: string; 
        stocks: number; 
    }[]; 
    status: "active" | "consumed" | "stale"
}


export type ReadingCore = Omit<Reading, keyof Metatype>;


export type CreateReadingDTO = Omit<Reading, keyof Metatype | "distribution" | "status" | "readingId">



