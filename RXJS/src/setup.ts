import { Chart } from "chart.js";
import { combineLatest, filter, forkJoin, fromEvent, map, merge, Observable, Subject } from "rxjs";
import ReactiveInput from "./components/ReactiveInput";
import Counter from "./models/counter";
import Hero from "./Models/hero";
import { Sinergy } from "./models/sinergy";
import statistika from "./models/statistika";
import createHeroObservable, { allSelected, racunajStatistiku } from "./Observables/heroObservable";
import createRandomHeroObservable from "./Observables/randomHeroObservable";


let sideHeroPosSelect = new Subject<[Hero,string]>();

function getSideHeroPosSelect() {
    return sideHeroPosSelect
}
export {getSideHeroPosSelect};

function createHeroInputs(heroInputs: ReactiveInput[]) {
    let reactiveInput:ReactiveInput;
    
    for(let i: number = 0; i < 5; i++) {
        reactiveInput  = new ReactiveInput;
        heroInputs.push(reactiveInput);
    }
    
}

export {createHeroInputs}


interface SideButtons {
    dire: HTMLInputElement;
    radient: HTMLInputElement;
}

export {SideButtons}

function displaySelection(direHeroInputs : ReactiveInput[], radientHeroInputs: ReactiveInput[], sideButtons : SideButtons, mainDiv: HTMLDivElement) {
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
    radientPart.id = 'inpf'
    inputField.appendChild(sideButtons.radient);

    radientPart.appendChild(inputField);

    roles.forEach((role, indx)=>{
        inputField = document.createElement("div");
        inputField.className = "inputField";

        let label : HTMLLabelElement = document.createElement("label");
        
        label.textContent = role + " :"

        inputField.appendChild(label);
        radientHeroInputs[indx].draw(inputField);
        
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
        direHeroInputs[indx].draw(inputField);
        
        direPart.appendChild(inputField);
    })
    
    selectionDiv.appendChild(direPart);


    

    mainDiv.appendChild(selectionDiv);

}

export { displaySelection}

function drawMidlane(radientHeroes: Hero[], direHeroes: Hero[], miniMap: HTMLDivElement) {
    
    if(radientHeroes[1] !== null) {
        let radientMid : HTMLImageElement = document.createElement("img");
        if(radientHeroes[1])radientMid.src = radientHeroes[1].image;
        else radientMid.src = "nohero.png"
        radientMid.className = "radientMid icon"
        miniMap.appendChild(radientMid);
    }

    if(direHeroes[1] !== null) {
        let direMid : HTMLImageElement = document.createElement("img");
         if(direHeroes[1])direMid.src = direHeroes[1].image;
         else direMid.src = "nohero.png"
         direMid.className = "direMid icon";
         miniMap.appendChild(direMid);
    }
    
}

function drawTopLane(radientHeroes : Hero[], direHeroes : Hero[], miniMap: HTMLDivElement) {
    if(direHeroes[0] !== null ) {
        let direCarry : HTMLImageElement = document.createElement("img");
        if(direHeroes[0]) direCarry.src = direHeroes[0].image
        else direCarry.src = "nohero.png"
        direCarry.className = "direCarry icon"
        miniMap.appendChild(direCarry);
    }
    if(direHeroes[4] !== null) {
        let direHardSupport : HTMLImageElement = document.createElement("img");
        if(direHeroes[4]) direHardSupport.src = direHeroes[4].image;
        else direHardSupport.src ="nohero.png"
        direHardSupport.className = "direHardSupport icon"
        miniMap.appendChild(direHardSupport);
    }
    if(radientHeroes[2] !== null) {
        let radientOfflaner : HTMLImageElement = document.createElement("img");
        if(radientHeroes[2]) radientOfflaner.src = radientHeroes[2].image;
        else radientOfflaner.src = "nohero.png"
        radientOfflaner.className = "radientOfflaner icon";
        miniMap.appendChild(radientOfflaner);
    }
    if(radientHeroes[3] !== null) {
        let radientSupport : HTMLImageElement = document.createElement("img");
        if(radientHeroes[3]) radientSupport.src = radientHeroes[3].image;
        else radientSupport.src = "nohero.png"
        radientSupport.className ="radientSupport icon"
        miniMap.appendChild(radientSupport);
    }
}

function drawBottomLane(radientHeroes: Hero[], direHeroes : Hero[], miniMap :HTMLDivElement) {

    if(radientHeroes[0] !== null) {
        let radientCarry : HTMLImageElement = document.createElement("img");
        if(radientHeroes[0])radientCarry.src = radientHeroes[0].image;
        else radientCarry.src = "nohero.png"
        radientCarry.className = "radientCarry icon";
        miniMap.appendChild(radientCarry);
    }
    if(radientHeroes[4] !== null) {
        let radientHardSupport : HTMLImageElement = document.createElement("img");
        if(radientHeroes[4]) radientHardSupport.src = radientHeroes[4].image;
        else radientHardSupport.src = "nohero.png"
        radientHardSupport.className ="radientHardSupport icon";
        miniMap.appendChild(radientHardSupport);
    }

    if(direHeroes[2] !== null) {
        let direOfflaner : HTMLImageElement = document.createElement("img");
        if(radientHeroes[2]) direOfflaner.src =direHeroes[2].image;
        else direOfflaner.src = "nohero.png"
        direOfflaner.className = "direOfflaner icon";
        miniMap.appendChild(direOfflaner);
    }

    if(direHeroes[3] !== null) {
        let direSuport : HTMLImageElement = document.createElement("img");
        if(direHeroes[3]) direSuport.src = direHeroes[3].image;
        else direSuport.src = "nohero.png"
        direSuport.className = "direSupport icon";
        miniMap.appendChild(direSuport);
    }
}

function displayMap(direHeroObservables : Observable<Hero[]> , radientHeroObservables : Observable<Hero[]>, mainDiv : HTMLDivElement) {
    let miniMap: HTMLDivElement = document.createElement("div");
    miniMap.className = "miniMap";

    let allHeroes: Observable<[Hero[], Hero[]]> = combineLatest([radientHeroObservables, direHeroObservables])
                                                .pipe(filter(x=>{
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
                                                }))
    ;
    allHeroes.subscribe(all=>{
        
        miniMap.textContent = "";
        drawMidlane(all[0], all[1],miniMap);
        drawTopLane(all[0],all[1], miniMap);
        drawBottomLane(all[0],all[1],miniMap);
        if(allSelected([...all[0],...all[1]])) {
            let stats: statistika = racunajStatistiku([...all[0],...all[1]])
            // displayStats(stats,mainDiv)
            // console.log("WOW")
        }
    });
        

    mainDiv.appendChild(miniMap);
}

export {displayMap}

function displayStats(stats:statistika, mainDiv:HTMLDivElement) {
    let statsCanvas : HTMLCanvasElement = document.createElement("canvas")
    statsCanvas.width = 400;
    statsCanvas.height = 400;
    statsCanvas.className = "statsDiv"
    let data = [stats.direCarry,stats.direMid,stats.direSupporting,stats.direHardSupport,stats.direOfflaner,
                stats.radientCarry,stats.radientMid,stats.radientSupporting,stats.direHardSupport,stats.radientOfflaner
                ]
    let ctx = statsCanvas.getContext("2d");

    let chart = new Chart(ctx,{
        type:'bar',
        data:{
            labels:["direCarry", "direMid","direSupport","direHardSupport","direOfflaner",
                    "radientCarry","radientMid","radientSupport","radientHardSupport","radientOfflaner"],
            datasets:[
                {label:'Statistika',
                 data

                }
            ]
        }
    })
    mainDiv.appendChild(statsCanvas)
    
}

function displayCounters(recomendations : Observable<Counter[]>, mainDiv : HTMLDivElement) {
    let countersDisplay : HTMLDivElement = document.createElement("div");
    countersDisplay.className = "countersDisplay";

    recomendations.subscribe(counters => {
        countersDisplay.textContent = "";
        let countersTitle : HTMLHeadingElement = document.createElement("h1");
        countersTitle.textContent = "#Counters"
        countersDisplay.appendChild(countersTitle)

        
        let icon : HTMLImageElement;
        let ime : HTMLParagraphElement;
        let counetrZa :HTMLSpanElement;
        counters.forEach(async (counter) =>{   
            let countersRow : HTMLDivElement;
            if(counter !== null) {
                countersRow = document.createElement("div");
                countersRow.className = "countersRow";
                let resp = await fetch("http://localhost:3000/hero/?name="+counter.name);
                let hero = (await resp.json())[0];
                let nextPos$ = drawBackFaceRandomHero(hero,countersRow,true,false);
                nextPos$.subscribe(pos=>{
                    getSideHeroPosSelect().next([hero,pos]);
                })
                icon = document.createElement("img");
                icon.src= counter.image
                countersRow.appendChild(icon);

                ime = document.createElement("p");
                ime.textContent = counter.name;

                counetrZa = document.createElement("span");
                counetrZa.textContent = "dobar protiv ("+counter.counteredHeroName+")"

                
                
                countersRow.appendChild(ime);
                countersRow.appendChild(counetrZa)
            

                countersDisplay.appendChild(countersRow);
            }
            
        })
    })

    mainDiv.appendChild(countersDisplay);
}

export { displayCounters}

function displaySinergies(sinergies : Observable<Sinergy[]>, mainDiv : HTMLDivElement){
    let sinergyDisplay : HTMLDivElement = document.createElement("div");
    sinergyDisplay.className = "sinergiesDisplay";

        sinergies.subscribe(sinergies => {
            sinergyDisplay.textContent = "";
            let sinergyTitle : HTMLHeadingElement = document.createElement("h1");
            sinergyTitle.textContent = "#Sinergies"
            sinergyDisplay.appendChild(sinergyTitle)

            let sinergyRow : HTMLDivElement;
            let icon : HTMLImageElement;
            let ime : HTMLParagraphElement;
            let quality: HTMLSpanElement;
            
            sinergies.forEach(sinergy =>{    
                if(sinergy !== null) {
                    sinergyRow = document.createElement("div");
                    sinergyRow.className = "countersRow";

                    icon = document.createElement("img");
                    icon.src= sinergy.hero.image
                    sinergyRow.appendChild(icon);

                    ime = document.createElement("p");
                    ime.textContent = sinergy.hero.name;
                    sinergyRow.appendChild(ime);

                    quality = document.createElement("span");
                    quality.textContent = sinergy.quality;
                    sinergyRow.appendChild(quality)
                    
                    
                    let nextPos$ = drawBackFaceRandomHero(sinergy.hero,sinergyRow,true,true);
                    nextPos$.subscribe(pos=>{
                        getSideHeroPosSelect().next([sinergy.hero,pos]);
                    })
                    sinergyDisplay.appendChild(sinergyRow);
                }
                
            })
    })

    mainDiv.appendChild(sinergyDisplay);
}

export {displaySinergies}

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


function displayChance(chanceObs: Observable<number>, mainDiv:HTMLDivElement) {
    let stats: HTMLDivElement = document.createElement("div");
    stats.style.textAlign="center"
    stats.className = 'stats'
    let radientLine: HTMLDivElement = document.createElement("div");
    let direLine: HTMLDivElement = document.createElement("div");
    stats.appendChild(radientLine);
    stats.appendChild(direLine);

    mainDiv.appendChild(stats);
    
    chanceObs.subscribe(chanceDire=>{
        if(chanceDire == -1) {
            direLine.textContent = '0%'
            direLine.style.width = '50%'
            radientLine.textContent = '0%'
            radientLine.style.width = '50%';
            return
        }
        let radientPercents:string =  chanceDire === 100? "" :  `${(100-chanceDire).toFixed(2)}%`;
        let direPercents:string =  chanceDire === 0 ? "" : `${chanceDire.toFixed(2)}%`;
        radientLine.textContent = radientPercents;
        radientLine.className ='radientLine';
        radientLine.style.width = radientPercents;
        direLine.textContent = direPercents;
        direLine.className = 'direLine';
        direLine.style.width = direPercents;
               
    })
}

export {displayChance}

function displayRandomHeroes(parrent: HTMLDivElement):HTMLDivElement{
    let allHeroes :HTMLDivElement = document.createElement("div");
    allHeroes.className = "radnomHeroes"
    parrent.appendChild(allHeroes);
    let x :HTMLButtonElement = document.createElement("button");
    x.textContent = "X";
    x.className = "UkloniRandomHeroes";
    allHeroes.appendChild(x)

    x.onclick = ()=>{
        parrent.removeChild(allHeroes)
    }
    return allHeroes;
}

function displayRandomHero(hero:Hero, parrent: HTMLDivElement){

    let heroCard : HTMLDivElement = document.createElement("div");
    heroCard.className = "heroCard";
    let heroInfoBig : HTMLDivElement = document.createElement("div");
    heroInfoBig.className = "heroInfoBig";

    let heroImageBig: HTMLImageElement = document.createElement("img");
    heroImageBig.src = hero.image;

    heroInfoBig.appendChild(heroImageBig);
    let heroNameBig = document.createElement("p")
    heroNameBig.textContent = hero.name;
    heroInfoBig.appendChild(heroNameBig);
    heroCard.appendChild(heroInfoBig)
    let heroPos = drawBackFaceRandomHero(hero,heroCard)

    let selectRandomHeroButton = document.createElement("button");
    selectRandomHeroButton.className = 'randomHeroSelectBtn'
    selectRandomHeroButton.textContent = "Select";
    heroCard.appendChild(selectRandomHeroButton);
    parrent.appendChild(heroCard);

    let fe = new Subject<Hero>();
    selectRandomHeroButton.onclick = ()=>{
        fe.next(hero);
    }
    return combineLatest([fe,heroPos]);
}

function drawBackFaceRandomHero(hero:Hero, parrent: HTMLDivElement,inSide:boolean = false, left:boolean=false) {
    let backface = document.createElement("div");
    backface.className = "heroCard__backface"
    if(inSide && left) 
        backface.classList.add("heroCard__backface--left")
    if(inSide && !left)
        backface.classList.add("heroCard__backface--right");
    let characteristic: HTMLParagraphElement;
    let spanLeft: HTMLSpanElement;
    let spanRight: HTMLSpanElement;
    let selectPos : HTMLInputElement;
    let selectStatPos : HTMLDivElement = document.createElement("div");
    selectStatPos.className = "selectStatPos"
    let statBtn : HTMLButtonElement = document.createElement("button")
    statBtn.className = "statBtn";
    statBtn.textContent = 'Stats';
    let posBtn : HTMLButtonElement = document.createElement("button")
    posBtn.className = 'posBtn'
    posBtn.textContent = 'Position'
    
    selectStatPos.appendChild(statBtn);

    let posSubject$ = new Subject<string>();

    selectStatPos.appendChild(posBtn);
    backface.appendChild(selectStatPos)
    let spanRightList : HTMLSpanElement[] = [];
    let radioPosList: HTMLInputElement[] = [];
    const no_pos = "no_pos";
    let selectedPos = no_pos;
    Object.keys(hero).forEach(key=>{
        if(key !== "id" && key !== 'name' && key !== 'sinergies' && key !== 'image') {
            characteristic = document.createElement("p");
            spanLeft = document.createElement("span");
            spanLeft.textContent = key+":";
            spanLeft.className = 'span-left';
            spanRight = document.createElement("span");
            selectPos = document.createElement("input");
            selectPos.type = "radio";
            selectPos.name = "heroPos"+hero.id;
            selectPos.value = key;
            if(!inSide)
                selectPos.onclick= ()=>{
                    posSubject$.next(key);
                }
            else {
                selectPos.onclick =()=>{
                    selectedPos = key;
                }
            }
            selectPos.style.display = "none"
            spanRight.textContent = (hero as any)[key];
            characteristic.appendChild(spanLeft);
            characteristic.appendChild(spanRight);
            spanRightList.push(spanRight);
            characteristic.appendChild(selectPos)
            radioPosList.push(selectPos);
            backface.appendChild(characteristic);
        }
    })
    let selectBtn = document.createElement("button");
    selectBtn.className = "SelectInBackFace";
    selectBtn.textContent = "select"
    if(inSide) selectBtn.onclick = ()=>{
        
        posSubject$.next(selectedPos)
    }
    backface.appendChild(selectBtn);

    statBtn.onclick = ()=>{
        spanRightList.forEach(sp=>{
            sp.style.display = "block";

        })
        radioPosList.forEach(p=>{
            p.style.display = "none"
        })
    }
    posBtn.onclick = ()=>{
        spanRightList.forEach(sp=>{
            sp.style.display = "none";

        })
        radioPosList.forEach(p=>{
            p.style.display = "block"
        })
    }

    parrent.appendChild(backface);
    return posSubject$;
}

let selectHero$ = new Subject<[Hero,string]>();

function displayRandomHeroesButton(parrent:HTMLDivElement){

    let button:HTMLButtonElement = document.createElement("button");
    let diceImg:HTMLImageElement = document.createElement("img");
    diceImg.src = "../dice.png";
    diceImg.className = "dice"
    button.className = "radnomHeroesBtn"
    button.appendChild(diceImg);
    
    button.onclick = ()=>{
        
        let allHeroes : HTMLDivElement = displayRandomHeroes(parrent);

        let allHeroesObs: Observable<[Hero, string]>[] = [];

        let createRandomHeroes$ = createRandomHeroObservable();
        
        createRandomHeroes$.subscribe(hero=>{
           allHeroesObs.push(displayRandomHero(hero,allHeroes));
        })
        forkJoin(createRandomHeroes$)
                .subscribe(
                    ()=>{
                        let e = merge(...allHeroesObs)
                        
                        e.subscribe(selHero=>{
                            selectHero$.next(selHero);
                        })
                    }
                )
    

    }

    parrent.appendChild(button);
    
    return selectHero$;
}

export {displayRandomHeroesButton}