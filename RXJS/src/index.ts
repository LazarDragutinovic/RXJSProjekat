import { Observable } from "rxjs";
import Hero from "./Models/hero";
import { createAllHeroesObservables } from "./Observables/heroObservable";
import createRecomendations from "./Observables/recomendationObservable";
import createSideObservable from "./Observables/sideObservable";
import createStateObservable from "./Observables/stateObservable";
import { createHeroInputs, displayCounters, displayMap, displaySelection, displaySideInput, makeAllObservable, makeSideButton, SideButtons } from "./setUp";






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
let recomendations = createRecomendations(state);
recomendations.subscribe(x=>console.log(x));
let sides : SideButtons = {dire: direSideButton, radient: radientSideButton};

let mainDiv : HTMLDivElement = document.createElement("div");
mainDiv.className = "mainDiv";

displaySelection(direHeroInputs, radientHeroInputs, sides, mainDiv);
displayMap(direHeroObservables, radientHeroObservables, mainDiv);
displayCounters(recomendations,mainDiv);

document.body.appendChild(mainDiv);