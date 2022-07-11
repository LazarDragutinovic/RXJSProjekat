import {switchMap, from, Observable , map, combineLatest} from "rxjs";
import Counter from "../models/counter";
import Hero from "../Models/hero";
import Recomendation from "../Models/recomendation";


function getRecomendation(ids : string) : Observable<Recomendation[]> {
    let promise : Promise<Recomendation[]> = fetch("http://localhost:3000/Recomendations/?" + ids)
                                            .then(resp=>{
                                                if(resp.ok) return resp.json();
                                                else throw new Error("Nema rekomendacija");
                                            })
                                            .catch(err=>console.log(err));
    return from(promise);
}

function getCounter(hero: Hero) : Observable<Counter> {
    
    let promise : Promise<Counter[]> = fetch("http://localhost:3000/Counters/?cid="+(hero!=null ? hero.id : -1))
                    .then(resp=>{
                        if(resp.ok) {
                            return resp.json();
                        }
                        else throw new Error("Nema tog countera")
                    }).catch(err=>console.error(err));
    return from(promise).pipe(map(x=>x.length > 0 ? x[0] : null));
}

export {getCounter}

function createRecomendations(state: Observable<Hero[]>) : Observable<Counter[]> {
    let recomendations : Observable<Counter[]> = state.pipe(
        map(heroes=>[getCounter(heroes[0]), getCounter(heroes[1]),getCounter(heroes[2]),getCounter(heroes[3]),getCounter(heroes[4])]),
        switchMap(counters=>combineLatest(counters))
    );
    return recomendations;
}


export default createRecomendations;