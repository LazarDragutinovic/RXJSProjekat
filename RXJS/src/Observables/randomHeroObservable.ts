import { filter, interval, map, Observable, switchMap, take } from "rxjs";
import Hero from "../Models/hero";
import { getHero, getHeroById } from "./heroObservable";




let randomHeroes : Hero[] = [];
function createRandomHeroObservable():Observable<Hero>{
    return interval(2000).pipe(map(x=> Math.ceil(Math.random() * 20)),switchMap(getHeroById) ,
        map(x=>{
            
            if(randomHeroes.find(hero=>hero.id == x[0].id))
                return null;
            if(randomHeroes.length == 5) {
                randomHeroes = [];
            }
            randomHeroes.push(x[0])    
            return x[0]
        }
        ),
        filter(x=>x!=null),
        take(5))
}


export default createRandomHeroObservable;