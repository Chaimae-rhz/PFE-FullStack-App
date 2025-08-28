import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {UserDTO} from "./user.model";
import {Observable} from "rxjs";
import {UpdateUserModel} from "./updateUser.model";
import {Admin} from "./admin.model";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://172.30.70.16:8082'; // URL du backend

  constructor(private httpClient: HttpClient) { }
  createAdmin( admin:Admin) : Observable<object>{
    return this.httpClient.post(`${this.baseUrl}/createAdmin` , admin)
  }

  updateAdmin(id : number , admin:Admin): Observable<object>{
    return  this.httpClient.put(`${this.baseUrl}/updateAdmin/${id}`,admin);
  }
  delateAdmin(id : number): Observable<object>{
    return this.httpClient.delete(`${this.baseUrl}/delateAdmin/${id}`);
  }
  getAdminById(adminId: string) {
    const url = `${this.baseUrl}/adminsById/${adminId}`;
    return this.httpClient.get(url);
  }
  checkEmailExists(email: string, currentAdminId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.baseUrl}/checkEmailExists?email=${email}&currentAdminId=${currentAdminId}`);
  }
}
