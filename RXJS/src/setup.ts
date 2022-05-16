import { combineLatest, Observable } from "rxjs";
import Hero from "./Models/hero";
import createHeroObservable from "./Observables/heroObservable";




function createHeroInputs(heroInputs: HTMLInputElement[]) {
    let input:HTMLInputElement;
    
    for(let i: number = 0; i < 5; i++) {
        input  = document.createElement("input");
        input.type = "text";
        input.className = "heroInput"
        heroInputs.push(input);
    }
    
}

export {createHeroInputs}


interface SideButtons {
    dire: HTMLInputElement;
    radient: HTMLInputElement;
}

export {SideButtons}

function displaySelection(direHeroInputs : HTMLInputElement[], radientHeroInputs: HTMLInputElement[], sideButtons : SideButtons, mainDiv: HTMLDivElement) {
    let selectionDiv : HTMLDivElement = document.createElement("div");
    selectionDiv.className = "selectionDiv";
    let roles = ["carry" , "mid","offlaner","support", "hard support"]
    let radientPart : HTMLDivElement = document.createElement("div");
    radientPart.className = "radientPart";
    let radientTitle : HTMLHeadingElement = document.createElement("h1");
    radientTitle.textContent = "Radient"
    radientPart.appendChild(radientTitle);
    let inputField : HTMLDivElement;

    radientPart.appendChild(radientTitle);

    inputField = document.createElement("div");
    inputField.className = "inputField";

    let label : HTMLLabelElement = document.createElement("label");
    label.textContent = "Side :"
    inputField.appendChild(label);

    inputField.appendChild(sideButtons.radient);

    radientPart.appendChild(inputField);

    roles.forEach((role, indx)=>{
        inputField = document.createElement("div");
        inputField.className = "inputField";

        let label : HTMLLabelElement = document.createElement("label");
        
        label.textContent = role + " :"

        inputField.appendChild(label);
        inputField.appendChild(radientHeroInputs[indx]);
        
        radientPart.appendChild(inputField);
    })

    
    
    
    selectionDiv.appendChild(radientPart);


    let direPart : HTMLDivElement = document.createElement("div");
    direPart.className = "direPart";
    
    let direTitle : HTMLHeadingElement = document.createElement("h1");
    direTitle.textContent = "Dire"
    direPart.appendChild(direTitle);
    
    inputField = document.createElement("div");
    inputField.className = "inputField";

     label = document.createElement("label");
    label.textContent = "Side :"
    inputField.appendChild(label);

    inputField.appendChild(sideButtons.dire);

    direPart.appendChild(inputField);

    roles.forEach((role,indx)=>{
        inputField = document.createElement("div");
        inputField.className = "inputField";

        let label : HTMLLabelElement = document.createElement("label");
        
        label.textContent = role + " :"

        inputField.appendChild(label);
        inputField.appendChild(direHeroInputs[indx]);
        
        direPart.appendChild(inputField);
    })
    
    selectionDiv.appendChild(direPart);


    

    mainDiv.appendChild(selectionDiv);

}

export { displaySelection}

function drawMidlane(radientHeroes: Hero[], direHeroes: Hero[], miniMap: HTMLDivElement) {
    
    if(radientHeroes[1] !== null) {
        let radientMid : HTMLImageElement = document.createElement("img");
        radientMid.src = radientHeroes[1].image;
        radientMid.className = "radientMid icon"
        miniMap.appendChild(radientMid);
    }

    if(direHeroes[1] !== null) {
        let direMid : HTMLImageElement = document.createElement("img");
         direMid.src = direHeroes[1].image;
         direMid.className = "direMid icon";
         miniMap.appendChild(direMid);
    }
    
}

function drawTopLane(radientHeroes : Hero[], direHeroes : Hero[], miniMap: HTMLDivElement) {
    if(direHeroes[0] !== null ) {
        let direCarry : HTMLImageElement = document.createElement("img");
        direCarry.src = direHeroes[0].image
        
        direCarry.className = "direCarry icon"
        miniMap.appendChild(direCarry);
    }
    if(direHeroes[4] !== null) {
        let direHardSupport : HTMLImageElement = document.createElement("img");
        direHardSupport.src = direHeroes[4].image;
        direHardSupport.className = "direHardSupport icon"
        miniMap.appendChild(direHardSupport);
    }
    if(radientHeroes[2] !== null) {
        let radientOfflaner : HTMLImageElement = document.createElement("img");
        radientOfflaner.src = radientHeroes[2].image;
        radientOfflaner.className = "radientOfflaner icon";
        miniMap.appendChild(radientOfflaner);
    }
    if(radientHeroes[3] !== null) {
        let radientSupport : HTMLImageElement = document.createElement("img");
        radientSupport.src = radientHeroes[3].image;
        radientSupport.className ="radientSupport icon"
        miniMap.appendChild(radientSupport);
    }
}

function drawBottomLane(radientHeroes: Hero[], direHeroes : Hero[], miniMap :HTMLDivElement) {

    if(radientHeroes[0] !== null) {
        let radientCarry : HTMLImageElement = document.createElement("img");
        radientCarry.src = radientHeroes[0].image;
        radientCarry.className = "radientCarry icon";
        miniMap.appendChild(radientCarry);
    }
    if(radientHeroes[4] !== null) {
        let radientHardSupport : HTMLImageElement = document.createElement("img");
        radientHardSupport.src = radientHeroes[4].image;
        radientHardSupport.className ="radientHardSupport icon";
        miniMap.appendChild(radientHardSupport);
    }

    if(direHeroes[2] !== null) {
        let direOfflaner : HTMLImageElement = document.createElement("img");
        direOfflaner.src =direHeroes[2].image;
        direOfflaner.className = "direOfflaner icon";
        miniMap.appendChild(direOfflaner);
    }

    if(direHeroes[3] !== null) {
        let direSuport : HTMLImageElement = document.createElement("img");
        direSuport.src = direHeroes[3].image;
        direSuport.className = "direSupport icon";
        miniMap.appendChild(direSuport);
    }
}

function displayMap(direHeroObservables : Observable<Hero[]> , radientHeroObservables : Observable<Hero[]>, mainDiv : HTMLDivElement) {
    let miniMap: HTMLDivElement = document.createElement("div");
    miniMap.className = "miniMap";

    let allHeroes: Observable<[Hero[], Hero[]]> = combineLatest([radientHeroObservables, direHeroObservables]);
    allHeroes.subscribe(all=>{
        
        miniMap.textContent = "";
        drawMidlane(all[0], all[1],miniMap);
        drawTopLane(all[0],all[1], miniMap);
        drawBottomLane(all[0],all[1],miniMap);
    });
        

    mainDiv.appendChild(miniMap);
}

export {displayMap}

function displayCounters(recomendations : Observable<Hero[]>, mainDiv : HTMLDivElement) {
    let countersDisplay : HTMLDivElement = document.createElement("div");
    countersDisplay.className = "countersDisplay";

    recomendations.subscribe(counters => {
        countersDisplay.textContent = "";
        let countersTitle : HTMLHeadingElement = document.createElement("h1");
        countersTitle.textContent = "#Counters"
        countersDisplay.appendChild(countersTitle)

        let countersRow : HTMLDivElement;
        let icon : HTMLImageElement;
        let ime : HTMLParagraphElement;
        counters.forEach(counter =>{    
            if(counter !== null) {
                countersRow = document.createElement("div");
                countersRow.className = "countersRow";

                icon = document.createElement("img");
                icon.src= counter.image
                countersRow.appendChild(icon);

                ime = document.createElement("p");
                ime.textContent = counter.name;
                countersRow.appendChild(ime);
            

                countersDisplay.appendChild(countersRow);
            }
            
        })
    })

    mainDiv.appendChild(countersDisplay);
}

export { displayCounters}

function makeAllObservable(heroInputs: HTMLInputElement[]) {
    heroInputs.forEach(heroinp=>{
        createHeroObservable(heroinp).subscribe(x=>console.log(x))
    })
}

export {makeAllObservable}

function displaySideInput(inp: HTMLInputElement, parrent: HTMLDivElement) {
    parrent.appendChild(inp);
}

export {displaySideInput}

function makeSideButton(side: string) : HTMLInputElement {
    let inp : HTMLInputElement = document.createElement("input");
    inp.type = "radio";
    inp.name = "side";
    inp.value = side;
    inp.className = "sideButton"
    return inp
}

export {makeSideButton}