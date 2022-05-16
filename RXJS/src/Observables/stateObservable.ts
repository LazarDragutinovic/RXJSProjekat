import { combineLatest, map, Observable } from "rxjs";
import Hero from "../Models/hero";






function createStateObservable(direHeroInputs: Observable<Hero[]> , radientHeroInputs : Observable<Hero[]>, sideObservable : Observable<string>) {


    return combineLatest([direHeroInputs, radientHeroInputs, sideObservable]).pipe(
        
        map(x=>x[2] == "dire" ? x[1] : x[0])
    )
    
}


export default createStateObservable;