import { combineLatest, debounceTime, filter, from, fromEvent, map, Observable, startWith, switchMap } from "rxjs";
import Hero from "../Models/hero";




function createAllHeroesObservables(inps: HTMLInputElement[]) : Observable<Hero[]> {
    let allObservables : Observable<Hero>[] = [];
    let heroObservable : Observable<Hero>;

    inps.forEach(inp=>{
        heroObservable = createHeroObservable(inp);
        allObservables.push(heroObservable);
    })
    return combineLatest(allObservables)
}

export {createAllHeroesObservables}

function createHeroObservable(inp:HTMLInputElement) : Observable<Hero> {
    return fromEvent(inp,"input").pipe(
        debounceTime(500),
        map(ev=>(<HTMLInputElement>ev.target).value),
        //filter(val=>val.length >= 3), ako se ovo ne onesposobi ne mogu se izbrisati heroji sa minimape
        switchMap(x=>getHero(x)),
        
        map(x=>x.length == 0? null : x[0]),
        startWith(null)
    );
}

function getHero(name: string) :Observable<Hero[]>  {
    let promise : Promise<Hero[]> = fetch('http://localhost:3000/hero/?name='+name)
                    .then((resp)=>{
                        if(resp.ok) {
                            return resp.json();
                        }
                        else throw new Error("No hero");
                    })
                    .catch(err=>console.log(err));
    return from(promise);
}


export default createHeroObservable;