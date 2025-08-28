
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {UserDTO} from "./user.model";
import {Observable, switchMap, throwError} from "rxjs";
import {UpdateUserModel} from "./updateUser.model";
import {Admin} from "./admin.model";
import {PersonneFSM} from "./personneFSM.model";

@Injectable({
  providedIn: 'root'
})
export class PersonneFSMService{
  private baseUrl = 'http://172.30.70.16:8082'; // URL du backend

  constructor(private http: HttpClient) {
  }

  createUser( personneFSM:PersonneFSM) : Observable<object>{
    return this.http.post(`${this.baseUrl}/addPersonneFsm` , personneFSM)
  }
}
