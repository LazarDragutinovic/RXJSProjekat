import { Sides } from "../setup";





function drawInterface(sideSelection: Sides,inputs: HTMLInputElement[], display: HTMLDivElement) {
    
    let root = document.getElementById("root");
    let selection: HTMLDivElement = document.createElement("div");
    inputs.forEach(el=>{
        selection.appendChild(el);
    })
    
    root.appendChild(selection)

}


export default drawInterface;