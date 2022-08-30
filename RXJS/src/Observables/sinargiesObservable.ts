import { combineLatest, from, map, Observable, switchMap } from "rxjs";
import Hero from "../Models/hero";
import { Quality, Sinergy } from "../models/sinergy";
import { getHero } from "./heroObservable";





function createSinargiesObservable(heroesObs: Observable<Hero[]>) : Observable<Sinergy[]> {
    let sinergies = heroesObs.pipe(map(getSinergies))
    let sinergiesData = sinergies.pipe(switchMap(sinergy=>getSinergiesData(sinergy.allSinergies)))
    

    let combinedData = combineLatest([sinergies,sinergiesData]).pipe(
        map(sinergiesAndData=>{
            
            let sinergies : Sinergy[] = [];
            sinergiesAndData[0].allSinergies.forEach(sinargyId=>{
                let hero = sinergiesAndData[1].find(sinergyData=>sinergyData.id == sinargyId);
                if(hero) {
                    sinergies.push({
                        hero,
                        quality: sinergiesAndData[0].qualities[sinargyId]
                    })
                }
            })
            
            return sinergies
        })
    )
    return combinedData
}

export {createSinargiesObservable}

function getSinergiesData(sinergiesIds: number[]) {
    return combineLatest(sinergiesIds.map(sid=>getHeroById(sid)));
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