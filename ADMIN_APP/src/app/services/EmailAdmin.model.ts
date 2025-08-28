import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export  class EmailAdmin{
  id! : number;
  email :string='';
  password : string='';
}
