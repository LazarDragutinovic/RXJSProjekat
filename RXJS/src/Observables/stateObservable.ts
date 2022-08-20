import { combineLatest, map, Observable } from "rxjs";
import Hero from "../Models/hero";
import { Side } from "../models/side";






function createStateObservable(direHeroInputs: Observable<Hero[]> , radientHeroInputs : Observable<Hero[]>, sideObservable : Observable<Side>) {


    return combineLatest([direHeroInputs, radientHeroInputs, sideObservable]).pipe(
        
        map(x=>x[2] == Side.Dire ? x[1] : x[0])
    )
    
}

function createStateObservableInverse(direHeroInputs: Observable<Hero[]> , radientHeroInputs : Observable<Hero[]>, sideObservable : Observable<Side>) {


    return combineLatest([direHeroInputs, radientHeroInputs, sideObservable]).pipe(
        
        map(x=>x[2] == Side.Radient ? x[0] : x[1])
    )
    
}

export {createStateObservableInverse}

export default createStateObservable;