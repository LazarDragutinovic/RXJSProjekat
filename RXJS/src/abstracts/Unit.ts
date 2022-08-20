import { Observable } from "rxjs";
import { ProjectileFactory } from "./Factory";
import { ProjectileTypes } from "./Projectile";

abstract class Unit {
    private x:number;
    private y:number;
    
    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }

    move(newX: number, newY: number): void {
        this.x = newX;
        this.y = newY;
    }
    abstract activate(): void;
    abstract animation():void;
}

export  abstract class Projectile extends Unit {
    
    baseDemage: number;
    demage: number;
    image: string;
    level$ : Observable<number>;

    constructor(x: number,y: number,baseDemage: number, image: string) {
        super(x,y);
        this.baseDemage = baseDemage;
        this.image = image;
    }
}

abstract class AttackUnit extends Unit {
    projectileFactory: ProjectileFactory;
    level$: Observable<number>;
    level: number;
    constructor(x: number, y: number, type: ProjectileTypes,level$:Observable<number>) {
        super(x,y)
        this.projectileFactory = new ProjectileFactory(type);
    }

    animation(): void {
        
    }
    
    attack(target: RegularUnit):void {
        
    }
}



abstract class RegularUnit extends AttackUnit {
    baseHealth: number;
    healthPerLevel: number;
    
    constructor(x: number,y:number,type: ProjectileTypes,baseHealth: number,healthPerLevel: number,level$: Observable<number>) {
        super(x,y,type,level$);
        this.baseHealth = baseHealth;
        this.healthPerLevel = healthPerLevel;

    }
    activate(): void {
        this.level$.subscribe(newLevel =>{
            this.level = newLevel;
        })
    }
    animation(): void {
        
    }
}