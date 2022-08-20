import { combineLatest, filter, map, Observable, pairwise, startWith } from "rxjs";
import ReactiveInput from "../components/ReactiveInput";
import Hero from "../Models/hero";
import { HeroPosSide } from "../models/HeroPosSide";
import { Side } from "../models/side";



function putHero(heroPosSide: HeroPosSide, radientHeroReactiveInputs: ReactiveInput[], direHeroReactiveInputs: ReactiveInput[]){
    if(heroPosSide.side === Side.Dire) {
        let positionNum = 0;
        switch (heroPosSide.pos) {
            case "carry":
                positionNum = 0;
                break;
            case "mid":
                positionNum = 1;
                break;
            case "offlaner":
                positionNum = 2;
                break;
            case "support":
                positionNum = 3;
                break;
            default:
                positionNum = 4;
        }
        direHeroReactiveInputs[positionNum].setHeroId(heroPosSide.hero.id.toString())
    }
    else {
        let positionNum = 0;
        switch (heroPosSide.pos) {
            case "carry":
                positionNum = 0;
                break;
            case "mid":
                positionNum = 1;
                break;
            case "offlaner":
                positionNum = 2;
                break;
            case "support":
                positionNum = 3;
                break;
            default:
                positionNum = 4;
        }
        radientHeroReactiveInputs[positionNum].setHeroId(heroPosSide.hero.id.toString())
    }
}

export {putHero}


let notDuplicateHero = (prevHero:Hero, currentHero:Hero)=>{
    return !(prevHero !==null && prevHero.id == currentHero.id);
}

function createHeroPosSelectorObservable(heroPosObs$: Observable<[Hero,string]>, sideObs$: Observable<Side>) {
    let allObs = [heroPosObs$,sideObs$];
    return combineLatest(allObs).pipe(map(all=>{
        let heroPosSide : HeroPosSide = {
            hero: all[0][0] as Hero,
            pos: all[0][1] as string,
            side: all[1] as Side
        }
        return heroPosSide;
    }),
    startWith(null),
    pairwise(),
    filter(heroes=>notDuplicateHero(heroes[0]? heroes[0].hero : null,heroes[1].hero)),
    map(heroes=>heroes[1]));

}


export default createHeroPosSelectorObservable;