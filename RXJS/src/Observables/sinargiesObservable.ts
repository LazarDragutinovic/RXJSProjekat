import { combineLatest, from, map, Observable, switchMap } from "rxjs";
import Hero from "../Models/hero";
import { Quality, Sinergy } from "../models/sinergy";
import { getHero } from "./heroObservable";





function createSinargiesObservable(heroesObs: Observable<Hero[]>) : Observable<Sinergy[]> {
    let sinergies = heroesObs.pipe(map(getSinergies))
    let sinergiesData = sinergies.pipe(switchMap(x=>getSinergiesData(x.allSinergies)))
    let combinedData = combineLatest([sinergies,sinergiesData]).pipe(
        map(x=>{
            let sinergies : Sinergy[] = [];
            x[0].allSinergies.forEach(s=>{
                let hero = x[1].find(x=>x.id == s);
                if(hero) {
                    sinergies.push({
                        hero,
                        quality: x[0].qualities[s]
                    })
                }
            })
            console.log(sinergies,"OVO")
            return sinergies
        })
    )
    return combinedData
}

export {createSinargiesObservable}

function getSinergiesData(sinergiesIds: number[]) {
    let sinergies:Observable<Hero>[] = []
    sinergiesIds.forEach(s=>{
        sinergies.push(getHeroById(s))
    })
    return combineLatest(sinergies);
}

function getHeroById(id: number) {
    let promise : Promise<Hero[]> = fetch('http://localhost:3000/hero/?id='+id)
                    .then((resp)=>{
                        if(resp.ok) {
                            return resp.json();
                        }
                        else throw new Error("No hero");
                    })
                    .catch(err=>alert("No Hero."));
    return from(promise).pipe(map(x=>x[0]));
}

function getSinergies(heroes: Hero[]){
    let allSinergies: number[] = []
    let qualities: { [key:number]:Quality } = {}
    for(let i = 0; i < 5;i++) {
        if(heroes[i]) {
            heroes[i].sinergies.forEach(s=>{
                if(!allSinergies.includes(s)){
                    allSinergies.push(s);
                    qualities[s] = Quality.OK;
                }
                else{
                    if(qualities[s] == Quality.OK) {
                        qualities[s] = Quality.GOOD
                    }
                    else if(qualities[s] == Quality.GOOD) {
                        qualities[s] = Quality.EXCELENT
                    }
                }
            })
        }
    }
    return {
        allSinergies,
        qualities
    }
}