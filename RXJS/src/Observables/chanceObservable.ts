import { combineLatest, filter, map, Observable, startWith, switchMap } from "rxjs";
import Counter from "../models/counter";
import Hero from "../Models/hero";
import { getCounter } from "./recomendationObservable";

import {filterDuplikata} from "./heroObservable"
import heroesAndCounters from "../models/heroesAndCounters";

function createChanceObservable(direHeroesObs: Observable<Hero[]>, radientHeroObs: Observable<Hero[]>) : Observable<number>{
    let heroes = combineLatest([direHeroesObs,radientHeroObs]).pipe(filter(heroes=>{
        let ponovljeno = false;
        for(let i = 0; i < 5; i++){
            if(!heroes[0][i]) continue;
            for(let j = 0; j < 5; j++){
                if(!heroes[1][j]) continue;
                if(heroes[0][i].id == heroes[1][j].id) {
                    ponovljeno = true 
                    break
                }
        
            }
            if(ponovljeno) break;
        }
        return !ponovljeno
    }));
    let counters = heroes.pipe(
        //preuzmi countere
        map(heroes=>{
            let heroesCombined:Hero[] = [];
            heroes[0].forEach(hero=>heroesCombined.push(hero));
            heroes[1].forEach(hero=>heroesCombined.push(hero));
            return heroesCombined;
        }), 
        switchMap(heroes=>getAllCounters(heroes))
        //uporedi heroje
        
        //daj ocenu
    )

    let heroesAndCounters$ = combineLatest([heroes,counters]).pipe(
        map(transformToHeroesAndCounters),
        map(heroesAndCounters=>preracunajSansu(heroesAndCounters)),
        startWith(0)
    )
    return heroesAndCounters$;
}

function transformToHeroesAndCounters(data: [[Hero[],Hero[]], Counter[]]) {
    
    let heroesAndCounters : heroesAndCounters = {
        direHeroes : data[0][0],
        radientHeroes: data[0][1],
        counters: data[1]
    }
    return heroesAndCounters;
}

function preracunajSansu(heroesAndCounters: heroesAndCounters){
    let direheroes = heroesAndCounters.direHeroes;
    let radientheroes = heroesAndCounters.radientHeroes;
    let counters = heroesAndCounters.counters

    let direChance = 0;
    let radientChance = 0;
    const sinargyPoints: number = 40;
    direheroes.forEach(hero=>{
        if(!hero) return;

        direheroes.forEach(direhero=>{
            if(direhero && direhero.id != hero.id) {
                if(hero.sinergies.includes(direhero.id)) direChance += sinargyPoints;
            } 
        })

        let counterForHero = null;
        for(let counter of counters) {
            if(counter && counter.cid == hero.id) {
                counterForHero = counter;
                break;
            }
        }
        if(counterForHero){
            for(let radientHero of radientheroes) {
                if(radientHero && radientHero.name == counterForHero.name)
                {
                    radientChance += counterForHero.wins;
                    direChance += (100 - counterForHero.wins)
                    break; 
                }
            }
        }
        
    })

    radientheroes.forEach(hero=>{
        if(!hero) return;

        radientheroes.forEach(radientHero=>{
            if(radientHero && radientHero.id != hero.id) {
                if(hero.sinergies.includes(radientHero.id)) radientChance += 30;
            } 
        })

        let counterForHero = null;
        for(let counter of counters) {
            if(counter && counter.cid == hero.id) {
                counterForHero = counter;
                break;
            }
        }
        if(counterForHero){
            for(let i = 0; i< 5;i++) {
                if(direheroes[i] && direheroes[i].name == counterForHero.name)
                {
                    direChance += counterForHero.wins;
                    radientChance += (100 - counterForHero.wins)
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
    return combineLatest(heroes.map(hero=>getCounter(hero)));
}