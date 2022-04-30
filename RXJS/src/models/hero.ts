
type Role = "Carry" | "Support" | "Midlaner" | "Roamer" | "Offlaner"

type Stars = 1 | 2 | 3 | 4 | 5

interface RoleAndProfitiency {
    Role: Role;
    Stars: Stars;
}
//Ovo je kul sto ce ima vise rolova jer ce moci da se vrsi pretraga po rolovima
interface Hero {
    id: number;
    name: string;
    Roles: RoleAndProfitiency[];

}