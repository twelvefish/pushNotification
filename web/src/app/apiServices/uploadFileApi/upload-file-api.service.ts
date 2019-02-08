import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'

@Injectable({
  providedIn: 'root'
})
export class UploadFileApiService {
  constructor(private auth: AngularFireAuth, private http: HttpClient) {
  }

  importFile(fileNmae: string, path: string, event: any): Promise<any> {
    console.log("fileNmae", fileNmae)
    console.log("event", event)
    console.log("path", path)
    return new Promise(async (resolve, reject) => {
      let fileToUploadBase = ""
      let fileToUpload = event.target.files.item(0)
      let file: File = event.target.files.item(0)
      let myReader: FileReader = new FileReader();

      myReader.onloadend = async (e) => {
        fileToUploadBase = myReader.result.toString()
        const url = environment.domainName + "file/uploadFileToStorage"
        this.http.post(url, { file: fileToUploadBase, filename: fileNmae, path: path }, {
          headers: new HttpHeaders({
            'authorization': `Bearer ${await this.getfirebaseIdToken()}`
          })
        }).toPromise()
          .then(success => {
            console.log(success)
            resolve(success)
          })
          .catch(error => {
            console.log(error)
            reject(error)
          })
      }

      myReader.readAsDataURL(file)
      console.log("this.fileToUpload :", fileToUpload)
    })
  }

  importGroupMember(groupName: string, memberId: string, event: any, type?: "group" | "batchGroup"): Promise<any> {
    return new Promise(async (resolve, reject) => {
      console.log("memberId", memberId)
      console.log("event", event)
      const url = environment.domainName + "member/importGroup"
      let fileToUploadBase = ""
      let fileToUpload = event.target.files.item(0)
      let file: File = event.target.files.item(0)
      let fileReader: FileReader = new FileReader()

      event.target.value = ""

      fileReader.onloadend = async (e) => {
        fileToUploadBase = fileReader.result.toString()
        this.http.post(url, {
          file: fileToUploadBase,
          ownerId: memberId,
          groupName: groupName,
          type: type
        }, {
            headers: new HttpHeaders({
              'authorization': `Bearer ${await this.getfirebaseIdToken()}`
            }), responseType: 'text'
          })
          .subscribe(async success => {
            console.log("success", success)
            resolve("ok")
          }, error => {
            console.log("error", error)
            reject(error)
          })

      }
      fileReader.readAsDataURL(file)
      console.log("this.fileToUpload :", fileToUpload)
    })
  }
  getfirebaseIdToken() {
    return this.auth.auth.currentUser.getIdToken()
  }
}
