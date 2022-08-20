import { Observable } from "rxjs";
import { ProjectileDemage } from "./Config";
import { Projectile } from "./Unit";


export enum ProjectileTypes {
    FireBolt='FireBolt'
}



export class FireBolt extends Projectile {
    constructor(x: number, y: number,level$: Observable<number>) {
        super(x,y,ProjectileDemage.FireBolt,"")
    }
    activate(): void {
        
    }
    animation(): void {
        
    }
}