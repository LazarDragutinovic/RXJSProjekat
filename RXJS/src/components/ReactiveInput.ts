import { debounceTime, filter, fromEvent, map, Observable, sampleTime, startWith, Subject, switchMap, tap } from "rxjs";
import { LoaderOptionsPlugin } from "webpack";
import Hero from "../Models/hero";
import { getHero, getHeroById } from "../Observables/heroObservable";

const invalid_hero_id: string = "-1024";
const select_active: string = 'reactive-input__select--active';

export default class ReactiveInput {
    
    private heroIdObs$: Subject<string>;
    private element: HTMLDivElement;
    private input: HTMLInputElement;
    private select: HTMLSelectElement;
    private hero$: Observable<Hero>;
    constructor(){
        this.input = document.createElement('input');
        this.select = document.createElement('select');
        this.element = document.createElement('div');
        this.element.className = 'reactive-input';
        this.input.className = 'reactive-input__input';
        this.select.className = 'reactive-input__select';        
    }
    draw(parent: HTMLDivElement) {
        this.element.appendChild(this.input);
        this.element.appendChild(this.select);
        parent.appendChild(this.element);
    }

    getHeroObs(): Observable<Hero> {
        let heroes$ = this.createHeroListObs();
        heroes$.subscribe(heroes=>{
            let option: HTMLOptionElement;
            this.select.innerHTML = '';

            if(heroes.length > 0)
                this.select.classList.add(select_active);
            else if(this.select.classList.contains(select_active)) 
                this.select.classList.remove(select_active)
                
            option = document.createElement("option");
            option.textContent = "Choose your hero";
            option.value = invalid_hero_id;
            this.select.appendChild(option);
            heroes.forEach(hero=>{
                option = document.createElement("option");
                option.className = 'reactive-input__option';
                option.text = hero.name;
                option.value = hero.id.toString();
                this.select.appendChild(option);
            })
        })              

        this.heroIdObs$ = new Subject<string>();
        this.select.onchange = ()=> {
            this.select.classList.remove(select_active);
            this.heroIdObs$.next(this.select.options[this.select.selectedIndex].value);
            
        }
        this.hero$ =  this.heroIdObs$.pipe(switchMap(getHeroById), map(heros => heros.length > 0 ? heros[0]: null));
        this.hero$.subscribe(hero=>{
            this.input.value = hero.name;
        })
        return this.hero$.pipe(startWith(null));
    }
    

    setHeroId(id: string){
        this.heroIdObs$.next(id);
    }
    createHeroListObs(): Observable<Hero[]> {
        let no_hero = "__no__hero__"
        return fromEvent(this.input,'input')
                .pipe(debounceTime(500),map((event: InputEvent)=> (<HTMLInputElement>event.target).value),
                    map((hero)=>hero.length == 0 ? no_hero : hero),
                    switchMap(heroName=>getHero(heroName)),
                    map(heroes=>{
                        console.log(heroes);
                        return heroes;
                    })
                )
    }
}