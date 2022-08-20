import { combineLatest, debounceTime, filter, from, fromEvent, map, merge, Observable, pairwise, startWith, Subject, switchMap, tap } from "rxjs";
import ReactiveInput from "../components/ReactiveInput";
import Hero from "../Models/hero";
import statistika from "../models/statistika";


let startingHeroes:any[] = [null,null, null, null, null,null,null,null,null,null];


let filterDuplikata = (heroes: Hero[])=>{
    console.log(heroes);
    for(let i = 0; i < heroes.length-1; i++) {
        if(!heroes[i]) continue;
        for(let j = 0; j < heroes.length;j++) {
            if(!heroes[j]) continue;
            if(i !== j) {
                if(heroes[i].id === heroes[j].id) return false;
            }
        }
    }   
    return true;
}

export function createAllReactiveHeroObservables(inputs: ReactiveInput[] ): Observable<Hero[]>{
    let reactiveHeroObservables$ = inputs.map(input=> input.getHeroObs());
    return combineLatest([...reactiveHeroObservables$])
            .pipe(filter(filterDuplikata));
}

function createAllHeroesObservables(inps: ReactiveInput[]) : Observable<Hero[]> {
    let allObservables : Observable<Hero>[] = [];
    let heroObservable : Observable<Hero>;

    heroObservable = inps[0].getHeroObs();
    console.log("HEre")

    heroObservable.subscribe(x=>console.log(x));
    combineLatest([inps[0].getHeroObs()]).subscribe(hero=>console.log(hero));

    for(let i = 0; i < 5; i++) {
        allObservables.push(inps[i].getHeroObs());
    }

    return combineLatest(allObservables).pipe(startWith(startingHeroes),filter(x=>{
        let ponovljeno = false;
        for(let i = 0; i < 5; i++) {
            if(!x[i]) continue;
            for(let j = 0 ; j<5; j++) {
                if(!x[j]) continue
                if( i == j ) continue;
                if(x[i].id == x[j].id) {
                    ponovljeno = true;
                    break;
                }
            }
            if(ponovljeno) break
        }

        return !ponovljeno
    }))
}


function allSelected(heroes: Hero[]) {
    let allOk = true;
   
    for(let i = 0; i < 10; i++) {
        
        if(!heroes[i]){
            allOk = false;
            break;
        }
    }
    
    return allOk
}


function racunajStatistiku(heroes:Hero[]):statistika {
    let radientSuporting = 0;
    let radientCarry = 0;
    let radientMid = 0;
    let radientOfflaner = 0;
    let radientHardSuport = 0;

    let direSuporting = 0;
    let direCarry = 0;
    let direMid = 0;
    let direOfflaner = 0;
    let direHardSuport = 0;

   
    for(let i = 0; i < 5; i++) {
        radientCarry += heroes[i].carry;
        radientHardSuport += heroes[i].hardSuport;
        radientMid += heroes[i].mid;
        radientOfflaner += heroes[i].offlaner;
        radientSuporting += heroes[i].support
    }
    radientCarry = radientCarry/5;
    radientHardSuport = radientHardSuport /5;
    radientMid = radientMid / 5;
    radientOfflaner = radientOfflaner / 5;
    radientSuporting = radientSuporting / 5;

    for(let i = 5; i < 10; i++) {
        direCarry += heroes[i].carry;
        direHardSuport += heroes[i].hardSuport;
        direMid += heroes[i].mid;
        direOfflaner += heroes[i].offlaner;
        direSuporting += heroes[i].support
    }
    direCarry = direCarry/5;
    direHardSuport = direHardSuport /5;
    direMid = direMid / 5;
    direOfflaner = direOfflaner / 5;
    direSuporting = direSuporting / 5;

    let stats : statistika = {
        radientSupporting: radientSuporting,
        direSupporting: direSuporting,
        radientCarry:radientCarry,
        direCarry: direCarry,
        radientMid:radientMid,
        direMid:direMid,
        radientHardSupport:radientHardSuport,
        direHardSupport:direHardSuport,
        radientOfflaner:radientOfflaner,
        direOfflaner:direOfflaner
    }
    return stats

}

export { allSelected, racunajStatistiku }

export {createAllHeroesObservables}

function createHeroObservable(inp:HTMLInputElement) : Observable<Hero> {
    return fromEvent(inp,"input").pipe(
        
        debounceTime(1000),
        map(ev=>(<HTMLInputElement>ev.target).value),
        
        //filter(val=>val.length >= 3), ako se ovo ne onesposobi ne mogu se izbrisati heroji sa minimape
        switchMap(x=>getHero(x)),
        
        map(x=>{
            
            return x.length == 0? undefined : x[0]}
            
            ),
        startWith(null)
    );
}

function getHero(name: string) :Observable<Hero[]>  {
    let promise : Promise<Hero[]> = fetch('http://localhost:3000/hero')
                    .then((resp)=>{
                        if(resp.ok) {
                            return resp.json();
                        }
                        else throw new Error("No hero");
                    })
                    .catch(err=>alert("No Hero."));

    return from(promise).pipe(map(heroes=>heroes.filter(hero=>hero.name.includes(name))));
}

function getHeroById(id: number | string) : Observable<Hero[]> {
    let promise : Promise<Hero[]> = fetch("http://localhost:3000/hero/?id="+id)
                                    .then(resp=>{
                                        if(resp.ok) return resp.json()
                                        else throw new Error("No hero");
                                    }).catch(err=>alert("No hero"));
    return from(promise)
}

export {getHero, getHeroById}

export default createHeroObservable;