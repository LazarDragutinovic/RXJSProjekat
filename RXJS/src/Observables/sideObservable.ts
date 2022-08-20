import { debounceTime, fromEvent, map, merge, mergeMap } from "rxjs";
import { Side } from "../models/side";




function createSideObservable(radientInput: HTMLInputElement, direInput : HTMLInputElement) {
    let radientObs = fromEvent(radientInput, "input").pipe(
        debounceTime(500),
        map(ev => Side.Radient),
    )
    let direObs = fromEvent(direInput,"input").pipe(
        debounceTime(500),
        map(ev=>Side.Dire)
    )
    return merge(radientObs,direObs);
}


export default createSideObservable;