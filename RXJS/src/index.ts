import { createDisplay, createInputs, createSideSelectors, Sides } from "./setup";
import drawInterface from "./views/Draw";



const heroInputs : HTMLInputElement[] = [];
const sideSelection : Sides = createSideSelectors();
const display : HTMLDivElement = createDisplay();
createInputs(heroInputs);
drawInterface(sideSelection, heroInputs, display);
setUpObservables();