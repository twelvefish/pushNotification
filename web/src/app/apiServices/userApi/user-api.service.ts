import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { User } from '../../model'

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private auth: AngularFireAuth, private http: HttpClient) { }

  createUser(email: string, name: string, role: User['role']) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "user/createUser"
      this.http.post(url, {
        name: name,
        email: email,
        role: role
      }, {
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
  updateUser(newUser: User) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "user/updateUser"
      this.http.put(url, newUser, {
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

  deleteUser(userId: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "user/deleteUser/" + userId
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

  importUser(event: any): Promise<any> {
    return new Promise(async (resolve, reject) => {

      console.log("event", event)
      const url = environment.domainName + "user/importUsers"
      let fileToUploadBase = ""
      let fileToUpload = event.target.files.item(0)
      let file: File = event.target.files.item(0)
      let fileReader: FileReader = new FileReader()

      event.target.value = ""

      fileReader.onloadend = async (e) => {
        fileToUploadBase = fileReader.result.toString()
        this.http.post(url, {
          file: fileToUploadBase
        }, {
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
      }
      fileReader.readAsDataURL(file)
      console.log("this.fileToUpload :", fileToUpload)
    })
  }
  resetUser(userId: string, email: string, password: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "user/resetUser"
      this.http.put(url, { userId: userId, email: email, password: password }, {
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
