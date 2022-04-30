import { raceInit } from "rxjs/internal/observable/race";

interface Sides {
    Radiant: HTMLInputElement;
    Dire: HTMLInputElement;
}


function createInputs(list: HTMLInputElement[]) {
    let element : HTMLInputElement;
    for(let i = 0; i < 10; i++) {
        element = document.createElement("input");
        element.type = "text";
        list.push(element);
    }
}

function createSideSelectors() : Sides {
    let Radiant: HTMLInputElement = document.createElement("input");
    Radiant.type = "radio"
    Radiant.name = "side"
    Radiant.value = "Radiant"

    let Dire: HTMLInputElement = document.createElement("input");
    Dire.type = "radio";
    Dire.name = "side"
    Dire.value = "Dire" 

    let sides: Sides = {
        Radiant,
        Dire
    }
    return sides;
}

function createDisplay() : HTMLDivElement {
    let display : HTMLDivElement = document.createElement("div");
    display.className = "Display";
    return display;
}



export {createInputs , Sides, createSideSelectors, createDisplay};