import { combineLatest, merge, Observable, Subject } from "rxjs";
import drawChart from "./charts";
import ReactiveInput from "./components/ReactiveInput";
import Hero from "./Models/hero";
import { Side } from "./models/side";
import { Sinergy } from "./models/sinergy";
import { createChanceObservable } from "./Observables/chanceObservable";
import { createAllHeroesObservables, createAllReactiveHeroObservables } from "./Observables/heroObservable";
import createHeroPosSelectorObservable, { putHero } from "./Observables/heroPosSelectorObservable";
import mergeRandomSideHeroPos from "./Observables/mergeRandomSideHeroPos";
import createRecomendations from "./Observables/recomendationObservable";
import createSideObservable from "./Observables/sideObservable";
import { createSinargiesObservable } from "./Observables/sinargiesObservable";
import createStateObservable, { createStateObservableInverse } from "./Observables/stateObservable";
import createStatsObservable, { handleChangeStats } from "./Observables/statsObservable";
import { createHeroInputs, displayChance, displayCounters, displayMap, displayRandomHeroesButton, displaySelection, displaySideInput, displaySinergies, getSideHeroPosSelect, makeAllObservable, makeSideButton, SideButtons } from "./setUp";








let direHeroReactiveInputs: ReactiveInput[] = [];

let radientHeroReactiveInputs : ReactiveInput[] =[];

let radientSideButton : HTMLInputElement = makeSideButton("radient");
let direSideButton : HTMLInputElement = makeSideButton("dire");


let sideObs : Observable<Side> = createSideObservable(radientSideButton,direSideButton)



createHeroInputs(direHeroReactiveInputs);
createHeroInputs(radientHeroReactiveInputs);

let direHeroObservables : Observable<Hero[]> = createAllReactiveHeroObservables(direHeroReactiveInputs);
let radientHeroObservables : Observable<Hero[]>  = createAllReactiveHeroObservables(radientHeroReactiveInputs);

let state = createStateObservable(direHeroObservables, radientHeroObservables, sideObs)
let stateInverse = createStateObservableInverse(direHeroObservables,radientHeroObservables,sideObs);
let recomendations = createRecomendations(state);
let sides : SideButtons = {dire: direSideButton, radient: radientSideButton};

let mainDiv : HTMLDivElement = document.createElement("div");

mainDiv.className = "mainDiv";

let observableData : HTMLDivElement = document.createElement("div");
observableData.className = "observableData";
let chanceObs :Observable<number> = createChanceObservable(direHeroObservables,radientHeroObservables);
let sinergiesObs: Observable<Sinergy[]> = createSinargiesObservable(stateInverse);
let showStatsBtn = document.createElement("button");
showStatsBtn.textContent = 'Show statisticks';
showStatsBtn.className = "show-stats-btn"
mainDiv.appendChild(showStatsBtn);
displaySelection(direHeroReactiveInputs, radientHeroReactiveInputs, sides, mainDiv);
let selectedRandomHero$ = displayRandomHeroesButton(mainDiv);

let sideHeroPos$ = getSideHeroPosSelect();

let heroPos$ = mergeRandomSideHeroPos(selectedRandomHero$,sideHeroPos$);

let HeroSelector = createHeroPosSelectorObservable(heroPos$,sideObs);
HeroSelector.subscribe(heroPosSide=>putHero(heroPosSide,radientHeroReactiveInputs,direHeroReactiveInputs));
displayChance(chanceObs,mainDiv)

mainDiv.appendChild(observableData);
let chart = drawChart(mainDiv,showStatsBtn);
let statsObservable$ = createStatsObservable(radientHeroObservables,direHeroObservables);
statsObservable$.subscribe(stats=>handleChangeStats(stats,chart));
displaySinergies(sinergiesObs,observableData)
displayMap(direHeroObservables, radientHeroObservables, observableData);

displayCounters(recomendations,observableData);

document.body.appendChild(mainDiv);