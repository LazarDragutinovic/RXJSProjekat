import { debounceTime, fromEvent, map, merge, mergeMap } from "rxjs";




function createSideObservable(radientInput: HTMLInputElement, direInput : HTMLInputElement) {
    let radientObs = fromEvent(radientInput, "input").pipe(
        debounceTime(500),
        map(ev => (<HTMLInputElement>ev.target).value),
    )
    let direObs = fromEvent(direInput,"input").pipe(
        debounceTime(500),
        map(ev=>(<HTMLInputElement>ev.target).value)
    )
    return merge(radientObs,direObs);
}


export default createSideObservable;