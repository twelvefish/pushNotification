import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AngularFireAuth } from 'angularfire2/auth'
import { Catalog } from '../../model'
import * as uuid from "uuid"

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {
  constructor(
    private auth: AngularFireAuth, private http: HttpClient) {
  }
  createCatalog(catalogName: string, type: Catalog['type'], userId: string) {
    return new Promise(async (resolve, reject) => {
      let id = uuid.v4()
      let message: Catalog = {
        id: id,
        name: catalogName,
        index: new Date().getTime(),
        type: type,
        userId: userId,
        messageId: []
      }
      const url = environment.domainName + "template/updateCatalog"
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
  updateCatalog(newCatalog: Catalog) {
    return new Promise(async (resolve, reject) => {
      let message: Catalog = {
        ...newCatalog
      }
      const url = environment.domainName + "template/updateCatalog"
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
  setCatalogMessageId(catalog: Catalog, id: string) {
    return new Promise(async (resolve, reject) => {
      catalog.messageId.push(id)
      const url = environment.domainName + "template/updateCatalog"
      this.http.post(url, catalog, {
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

  deleteCatalog(catalogId: string) {
    return new Promise(async (resolve, reject) => {
      const url = environment.domainName + "template/deleteCatalog/" + catalogId
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
  deleteCatalogMessageId(catalog: Catalog, id: string) {
    return new Promise(async (resolve, reject) => {
      catalog.messageId.splice(catalog.messageId.indexOf(id), 1)
      const url = environment.domainName + "template/updateCatalog"
      this.http.post(url, catalog, {
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
