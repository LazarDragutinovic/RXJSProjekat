import { filter, interval, map, Observable, switchMap, take } from "rxjs";
import Hero from "../Models/hero";
import { getHero, getHeroById } from "./heroObservable";


let hero_in_db = 20;


function createRandomHeroObservable():Observable<Hero>{
    let randomHeroes : Hero[]=[];

    let isDuplicate = (hero: Hero)=>{
        if(randomHeroes.find(heroInList=>heroInList.id == hero.id))
            return true;
        else {
            randomHeroes.push(hero);
            return false;
        }
    }
    return interval(2000).
        pipe(map(_=> Math.ceil(Math.random() * hero_in_db)),
        switchMap(randomHeroId=>getHeroById(randomHeroId)) ,
        map(heroes=>{
            if(isDuplicate(heroes[0])) return null;
            return heroes[0]
        }
        ),
        filter(hero=>hero!=null),
        take(5))
}


export default createRandomHeroObservable;