import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export  class Admin{
  id ! :number;
  email :string='';
  password : string='';
  superAdmin : boolean=false;
}
