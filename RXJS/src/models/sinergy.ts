import Hero from "./hero"

enum Quality {
    OK="OK",
    GOOD="GOOD",
    EXCELENT="EXCELENT"
}
export {Quality}

export interface Sinergy {
    quality: Quality,
    hero: Hero;
}