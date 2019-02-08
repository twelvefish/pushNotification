import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Urls, Member, User } from '../../model';
import { AngularFireAuth } from 'angularfire2/auth'

@Injectable({
  providedIn: 'root'
})
export class PushMessageApiService {

  constructor(private auth: AngularFireAuth, private http: HttpClient) {

  }

  async replyMessageNew(staff: User, receiver: Member, channel: string, message: string, urls?: Urls[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "push/replyMessage"

      const success = await this.http.post(url, {
        staff, receiver, message, urls, channel
      }, {
          headers: new HttpHeaders({
            'authorization': `Bearer ${await this.getfirebaseIdToken()}`
          }), responseType: 'text'
        }).subscribe(async success => {
          console.log("success", success)
          resolve("ok")
        }, error => {
          console.log("error", error)
          reject(error)
        })
    })
  }

  async sendByPushMessage(message: Event): Promise<any> {
    const url = environment.domainName + "event/createEvent"
    try {
      const success = await this.http.post(url, message, {
        headers: new HttpHeaders({
          'authorization': `Bearer ${await this.getfirebaseIdToken()}`
        }), responseType: 'text'
      }).toPromise();
      return Promise.resolve(success)
    }
    catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  }

  async pubId(id: string): Promise<any> {
    console.log(id)
    const url = environment.domainName + "event/publish"
    try {
      const success = await this.http.post(url, { id: id }, {
        headers: new HttpHeaders({
          'authorization': `Bearer ${await this.getfirebaseIdToken()}`
        }), responseType: 'text'
      }).toPromise();
      console.log("success")
      return Promise.resolve(success);
    }
    catch (err) {
      console.log(err)
      return Promise.reject(err)
    }
  }
  getfirebaseIdToken() {
    return this.auth.auth.currentUser.getIdToken()
  }
}
