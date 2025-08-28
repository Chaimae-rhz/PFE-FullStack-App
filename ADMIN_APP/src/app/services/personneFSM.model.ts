import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PersonneFSM{
  id ! :number;
  ppr : string='';
  dateNaissance :string='';
}
