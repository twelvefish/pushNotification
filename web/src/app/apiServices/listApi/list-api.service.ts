import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { List } from "../../model"

@Injectable({
  providedIn: 'root'
})
export class ListApiService {

  constructor(private auth: AngularFireAuth, private http: HttpClient) { }

  deleteList(id: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "member/deleteBatchGroup/" + id
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

  updateList(newBatchGroup: List) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "member/updateBatchGroup"
      this.http.post(url, newBatchGroup, {
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
