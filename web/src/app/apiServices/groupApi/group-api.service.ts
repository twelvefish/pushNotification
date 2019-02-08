import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { Group } from "../../model"

@Injectable({
  providedIn: 'root'
})
export class GroupApiService {

  constructor(private auth: AngularFireAuth, private http: HttpClient) {
  }
  deleteGroup(id: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "member/deleteGroup/" + id
      this.http.delete(url, {
        headers: new HttpHeaders({
          'authorization': `Bearer ${await this.getfirebaseIdToken()}`
        }), responseType: 'text'
      }).toPromise()
        .then(async success => {
          console.log("success", success)
          resolve("ok")
        })
        .catch(error => {
          console.log("error", error)
          reject(error)
        })
    })
  }

  updateGroup(newGroup: Group) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "member/updateGroup"
      this.http.post(url, newGroup, {
        headers: new HttpHeaders({
          'authorization': `Bearer ${await this.getfirebaseIdToken()}`
        }), responseType: 'text'
      }).toPromise()
        .then(async success => {
          console.log("success", success)
          resolve("ok")
        })
        .catch(error => {
          console.log("error", error)
          reject(error)
        })
    })
  }

  getfirebaseIdToken() {
    return this.auth.auth.currentUser.getIdToken()
  }
}
