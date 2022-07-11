import { combineLatest, filter, map, Observable, startWith, switchMap } from "rxjs";
import Counter from "../models/counter";
import Hero from "../Models/hero";
import { getCounter } from "./recomendationObservable";



function createChanceObservable(direHeroesObs: Observable<Hero[]>, radientHeroObs: Observable<Hero[]>) : Observable<number>{
    let heroes = combineLatest([direHeroesObs,radientHeroObs]).pipe(filter(x=>{
        let ponovljeno = false;
        for(let i = 0; i < 5; i++){
            if(!x[0][i]) continue;
            for(let j = 0; j < 5; j++){
                if(!x[1][j]) continue;
                if(x[0][i].id == x[1][j].id) {
                    ponovljeno = true 
                    break
                }
        
            }
            if(ponovljeno) break;
        }
        return !ponovljeno
    }));
    let chance = heroes.pipe(
        //preuzmi countere
        map(x=>{
            let heroes:Hero[] = [];
            x[0].forEach(x=>heroes.push(x));
            x[1].forEach(x=>heroes.push(x))
            return heroes
        }), 
        switchMap(heroes=>getAllCounters(heroes))
        //uporedi heroje
        
        //daj ocenu
    )

    let provera = combineLatest([heroes,chance]).pipe(
        map(x=>preracunajSansu(x)),
        startWith(0)
    )
    return provera
}


function preracunajSansu(data: [[Hero[],Hero[]], Counter[]]){
    let direheroes = data[0][0]
    let radientheroes = data[0][1]
    let counters = data[1]

    let direChance = 0;
    let radientChance = 0;

    direheroes.forEach(hero=>{
        if(!hero) return;

        direheroes.forEach(dh=>{
            if(dh && dh.id != hero.id) {
                if(hero.sinergies.includes(dh.id)) direChance += 30;
            } 
        })

        let counter = null;
        for(let i = 0; i < 5; i++) {
            if(counters[i] && counters[i].cid == hero.id) {
                counter = counters[i]
                break;
            }
        }
        if(counter){
            for(let i = 0; i< 5;i++) {
                if(radientheroes[i] && radientheroes[i].name == counter.name)
                {
                    radientChance += counter.wins;
                    direChance += (100 - counter.wins)
                    break; 
                }
            }
        }
        
    })

    radientheroes.forEach(hero=>{
        if(!hero) return;

        radientheroes.forEach(rh=>{
            if(rh && rh.id != hero.id) {
                if(hero.sinergies.includes(rh.id)) radientChance += 30;
            } 
        })

        let counter = null;
        for(let i = 5; i < 10; i++) {
            if(counters[i] && counters[i].cid == hero.id) {
                counter = counters[i]
                break;
            }
        }
        if(counter){
            for(let i = 0; i< 5;i++) {
                if(direheroes[i] && direheroes[i].name == counter.name)
                {
                    direChance += counter.wins;
                    radientChance += (100 - counter.wins)
                    break; 
                }
            }
        }
        
    })

    let totalChance = radientChance + direChance;
    if(totalChance == 0) return -1;
    return ((direChance * 1.0) / totalChance)*100;
}

export {createChanceObservable}

function getAllCounters(heroes: Hero[]): Observable<Counter[]> {
    let counters : Observable<Counter>[] = [];
    heroes.forEach(hero=>{
        counters.push(getCounter(hero))
    })

    return combineLatest(counters);
}