import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { ReviewMessage } from '../../model'

@Injectable({
  providedIn: 'root'
})
export class ReviewMessageApiService {

  constructor(private auth: AngularFireAuth, private http: HttpClient) { }

  createReviewMessage(reviewMessage: ReviewMessage) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "reviewMessage/createReviewMessage"
      this.http.post(url, { ...reviewMessage }, {
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
  updateReviewMessageState(reviewMessageId: string, reviewMessageState: number) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + `reviewMessage/updateReviewMessageState/${reviewMessageId}/${reviewMessageState}`
      this.http.put(url, {}, {
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
  agree(reviewMessageId: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + `reviewMessage/agree/${reviewMessageId}`
      this.http.post(url, {}, {
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
  reject(reviewMessageId: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + `reviewMessage/reject/${reviewMessageId}`
      this.http.post(url, {}, {
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
  deleteReviewMessage(messageId: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "reviewMessage/deleteReviewMessage/" + messageId
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
  getfirebaseIdToken() {
    return this.auth.auth.currentUser.getIdToken()
  }

}
