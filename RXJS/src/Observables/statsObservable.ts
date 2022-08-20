import { Chart } from "chart.js";
import { combineLatest, map, Observable } from "rxjs";
import Hero from "../Models/hero";
import stats, { heroStats, heroStatsArrays } from "../models/stats";

let heroToStats = (hero:Hero)=>{
    let heroStats: heroStats = {
        carry: hero.carry,
        mid: hero.mid,
        offlaner: hero.offlaner,
        support: hero.support,
        hardSupport: hero.hardSuport
    }
    return heroStats;
}

let heroesToStats = (allHeroes:[Hero[],Hero[]])=>{
    let radientHeroes = allHeroes[0];
    let direHeroes = allHeroes[1];
    let stats : stats = {
        radientLabels: [],
        radientData: [],
        direLabels: [],
        direData: []
    }
    radientHeroes
    .filter(hero=>hero != null)
    .forEach(hero=>{
        stats.radientLabels.push(hero.name);
        let heroStats: heroStats = heroToStats(hero);
        stats.radientData.push(heroStats);
    })

    direHeroes
    .filter(hero=>hero != null)
    .forEach(hero=>{
        stats.direLabels.push(hero.name);
        let heroStats : heroStats = heroToStats(hero);
        stats.direData.push(heroStats);
    })
    return stats
}



function createStatsObservable(radientHeroes$: Observable<Hero[]>, direHeroes$: Observable<Hero[]>){

    return combineLatest([radientHeroes$,direHeroes$])
                        .pipe(map(allHeroes=>heroesToStats(allHeroes)));

}

export default createStatsObservable;

let handleChangeStats = (stats:stats, chart:Chart) =>{
    let allLabels: string[] = [];
    let colors : string[] = [];
    enum Colors {
        red="red",
        green="green"
    }
    stats.radientLabels.forEach(label=>{
        allLabels.push(label);
        colors.push(Colors.green);
    })
    stats.direLabels.forEach(label=>{
        allLabels.push(label);
        colors.push(Colors.red)
    })
    chart.data.labels = allLabels;
    let allData: heroStatsArrays ={
        carry: [],
        mid: [],
        offlaner: [],
        support: [],
        hardSupport: []
    };
    stats.radientData.forEach(data=>{
        allData.carry.push(data.carry);
        allData.mid.push(data.mid);
        allData.offlaner.push(data.offlaner);
        allData.support.push(data.support);
        allData.hardSupport.push(data.hardSupport)
    })
    stats.direData.forEach(data=>{
        allData.carry.push(data.carry);
        allData.mid.push(data.mid);
        allData.offlaner.push(data.offlaner);
        allData.support.push(data.support);
        allData.hardSupport.push(data.hardSupport)
    })
    
    chart.data.labels = allLabels;
    chart.data.datasets[0].data = allData.carry;
    chart.data.datasets[0].label = 'carry'
    chart.data.datasets[0].backgroundColor = colors;
    chart.data.datasets[1].data = allData.mid;
    chart.data.datasets[1].label = 'mid'
    chart.data.datasets[1].backgroundColor = colors;
    chart.data.datasets[2].data = allData.offlaner;
    chart.data.datasets[2].label = 'offlaner'
    chart.data.datasets[2].backgroundColor = colors;
    chart.data.datasets[3].data = allData.support;
    chart.data.datasets[3].label = 'support'
    chart.data.datasets[3].backgroundColor = colors;
    chart.data.datasets[4].data = allData.hardSupport;
    chart.data.datasets[4].label = 'hard support'
    chart.data.datasets[4].backgroundColor = colors;
    chart.update();

} 

export { handleChangeStats }