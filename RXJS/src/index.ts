import { Observable } from "rxjs";
import Hero from "./Models/hero";
import { Sinergy } from "./models/sinergy";
import { createChanceObservable } from "./Observables/chanceObservable";
import { createAllHeroesObservables } from "./Observables/heroObservable";
import createRecomendations from "./Observables/recomendationObservable";
import createSideObservable from "./Observables/sideObservable";
import { createSinargiesObservable } from "./Observables/sinargiesObservable";
import createStateObservable, { createStateObservableInverse } from "./Observables/stateObservable";
import { createHeroInputs, displayChance, displayCounters, displayMap, displayRandomHeroesButton, displaySelection, displaySideInput, displaySinergies, makeAllObservable, makeSideButton, SideButtons } from "./setUp";






let direHeroInputs : HTMLInputElement[] = [];
let radientHeroInputs: HTMLInputElement[] =[];

let radientSideButton : HTMLInputElement = makeSideButton("radient");
let direSideButton : HTMLInputElement = makeSideButton("dire");


let sideObs : Observable<string> = createSideObservable(radientSideButton,direSideButton)



createHeroInputs(direHeroInputs);
createHeroInputs(radientHeroInputs);

let direHeroObservables : Observable<Hero[]> = createAllHeroesObservables(direHeroInputs);
let radientHeroObservables : Observable<Hero[]>  = createAllHeroesObservables(radientHeroInputs);

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

displaySelection(direHeroInputs, radientHeroInputs, sides, mainDiv);
displayRandomHeroesButton(mainDiv);
displayChance(chanceObs,mainDiv)

mainDiv.appendChild(observableData);
displaySinergies(sinergiesObs,observableData)
displayMap(direHeroObservables, radientHeroObservables, observableData);

displayCounters(recomendations,observableData);

document.body.appendChild(mainDiv);