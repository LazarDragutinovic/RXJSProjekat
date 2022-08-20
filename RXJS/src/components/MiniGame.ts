import { Observable, Subject } from "rxjs";
import Displayable from "../abstracts/Displayabel";

enum GameState {
    NewGame='NewGame',
    Paused='Paused',
    Active='Active',
    Finished='Finished',
    PreStart='PreStart'
}

export default class MiniGame extends Displayable {

    miniGame: HTMLDivElement;
    btnActivate:HTMLButtonElement;
    btnPause:HTMLButtonElement;
    btnNewGame:HTMLButtonElement;

    state$: Subject<GameState>;

    constructor(private showMiniGame$: Subject<boolean>) {
        super();
        this.miniGame = document.createElement("div");
        this.miniGame.className = "mini-game";
        this.state$ = new Subject<GameState>();
        this.setup();
        this.setupHandlers()
        this.state$.next(GameState.PreStart);
        this.state$.subscribe(x=>console.log(x))
        
    }

    setup() {
        this.btnActivate = document.createElement('button')
        this.btnActivate.textContent = 'Activate'
        this.btnActivate.className = 'mini-game__button mini-game__button--activete'
        this.btnPause = document.createElement('button')
        this.btnPause.textContent = 'Pause'
        this.btnPause.className = 'mini-game__button mini-game__button--pause'
        this.btnNewGame = document.createElement('button')
        this.btnNewGame.textContent = 'New Game'
        this.btnNewGame.className = 'mini-game__button mini-game__button--new-game'
        let controlls = document.createElement('div');

        controlls.className = 'mini-game__controlls';
        controlls.appendChild(this.btnActivate);
        controlls.appendChild(this.btnPause);
        controlls.appendChild(this.btnNewGame);
        this.miniGame.appendChild(controlls);
        let showMiniGameBtn = document.createElement("button");
        showMiniGameBtn.textContent = "Drafting";
        showMiniGameBtn.onclick = ()=>{
            this.showMiniGame$.next(false);
        }
        controlls.appendChild(showMiniGameBtn)
    }
    
    setupHandlers() {
        this.btnActivate.onclick = ()=>{
            this.state$.next(GameState.Active);
        }
        this.btnPause.onclick = ()=>{
            this.state$.next(GameState.Paused);
        }
        this.btnNewGame.onclick = ()=>{
            this.state$.next(GameState.NewGame)
        }
    }

    

    display(parent: HTMLElement): void {

        parent.appendChild(this.miniGame);
    }

    hide(parent: HTMLElement):void {
        parent.removeChild(this.miniGame);
    }
}