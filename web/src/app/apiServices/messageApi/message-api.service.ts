import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { Message } from '../../model'

@Injectable({
  providedIn: 'root'
})
export class MessageApiService {

  constructor(private auth: AngularFireAuth, private http: HttpClient) {
  }

  updateTemplate(messageId: string, messageTitle: string, messageThumb: string, messageContent: string) {
    return new Promise(async (resolve, reject) => {
      let message: Message = {
        id: messageId,
        title: messageTitle,
        content: messageContent,
        thumb: messageThumb
      }
      const url = environment.domainName + "template/updateTemplate"
      this.http.post(url, message, {
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
  deleteTemplate(messageId: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "template/deleteTemplate/" + messageId
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
