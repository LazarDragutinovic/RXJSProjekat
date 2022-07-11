import Hero from "./hero";

export default interface Counter {
    cid:number,
    name:string,
    image:string,
    wins: number,
    counteredHeroName: string
}