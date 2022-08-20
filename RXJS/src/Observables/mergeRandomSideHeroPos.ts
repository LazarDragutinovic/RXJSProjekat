import { merge, Observable } from "rxjs";
import Hero from "../Models/hero";





function mergeRandomSideHeroPos(randomHeroPos: Observable<[Hero,string]>, sideHeroPos: Observable<[Hero,string]>){
    return merge(randomHeroPos,sideHeroPos);
}

export default mergeRandomSideHeroPos;