import { FireBolt, ProjectileTypes } from "./Projectile";
import { Projectile } from "./Unit";


export  class  ProjectileFactory {
    type: ProjectileTypes;
    constructor(type:ProjectileTypes) {
        this.type = type;
    }
    createProjectile():Projectile {
        
        throw new Error();
    }
}