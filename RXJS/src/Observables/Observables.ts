import { debounce, debounceTime, filter, fromEvent, merge, Observable, pairwise, map, startWith, of, from, switchMap, combineLatest } from "rxjs";
import environment from "../environment";
import { Sides } from "../setup";



function createSideObservable(sideSelection: Sides) : Observable<string> {
    let radiantOb$ : Observable<string> = fromEvent(sideSelection.Radiant, "input")
                                          .pipe(
                                              debounceTime(500),
                                              map(ev => (<HTMLInputElement>ev.target).value),
                                              pairwise(),
                                              filter(p=> p[0]!==p[1]),
                                              map(p=> p[0])
                                          )

    let direOb$ : Observable<string>  = fromEvent(sideSelection.Dire,"click")
                                          .pipe(
                                              debounceTime(500),
                                              map(ev=> (<HTMLInputElement>ev.target).value),
                                              pairwise(),
                                              filter(p=>p[0] !== p[1]),
                                              map(p=>p[0])
                                          )

    let side : Observable<string> = merge(radiantOb$,direOb$);
    return side;
}

function getHero(name: string) : Observable<Hero[]> {
    let promise : Promise<Hero[]> = fetch(environment.API+name)
                                    .then(resp=>{
                                        if(resp.ok) return resp.json();
                                        else throw new Error("Nema tog heroja")
                                    }).catch(err=>console.error(err));
    return from(promise);
}

function createHeroObservable(inputs : HTMLInputElement[]) : Observable<Hero[]> {
    let heroe$ : Observable<Hero>[] = [];
    let heroOb$ : Observable<Hero>;
    inputs.forEach(heroInput => {
        heroOb$ = fromEvent(heroInput, "input")
                            .pipe(
                                debounceTime(500),
                                map(ev=> (<HTMLInputElement>ev.target).value),
                                filter(val=>val.length > 2),
                                switchMap(name => getHero(name)),
                                map(heroes=>heroes[0])
                            );
        heroe$.push(heroOb$);
    });
    return combineLatest(heroe$);
}

function setUpObservables(sideSelection: Sides, inputs : HTMLInputElement[], display: HTMLDivElement) {
    let sideObservable$ : Observable<string> = createSideObservable(sideSelection);
    let heroObservble$ : Observable<Hero[]> = createHeroObservable(inputs); 
}