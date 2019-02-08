import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

import { Catalog, Message } from "../../model"
import { Observable } from "rxjs"
import * as uuid from "uuid"

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private catalogCollection: AngularFirestoreCollection<Catalog>

  constructor(private database: AngularFirestore) {
    this.catalogCollection = this.database.collection<Catalog>("Catalog", ref => ref.orderBy("index"));
  }

  getCatalogs(): Observable<Catalog[]> {
    return this.catalogCollection.valueChanges();
  }

  getCatalogByType(type: string): Observable<Catalog[]> {
    return this.database.collection<Catalog>("Catalog", ref => ref.where("type", "==", type).orderBy("index")).valueChanges()
  }

  getCatalogByTypeAndUserId(type: string, userId: string): Observable<Catalog[]> {
    return this.database.collection<Catalog>("Catalog", ref => ref.where("type", "==", type).where("userId", "==", userId).orderBy("index")).valueChanges()
  }

  getMessagesByCatalogId(catalogId: string): Observable<Message[]> {
    return this.catalogCollection.doc(catalogId).collection<Message>("Message", ref => ref.orderBy("index")).valueChanges()
  }

  createCatalog(catalogName: string, type: string, userId: string): Promise<any> {
    let id = uuid.v4()
    return this.catalogCollection.doc(id).set({ id: id, name: catalogName, index: new Date().getTime(), type: type, userId: userId, messageId: [] })
  }

  setCatalogMessageId(catalog: Catalog, id: string): Promise<any> {
    catalog.messageId.push(id)
    return this.catalogCollection.doc(catalog.id).set(catalog, { merge: true })
  }

  deleteCatalogMessageId(catalog: Catalog, id: string): Promise<any> {
    catalog.messageId.splice(catalog.messageId.indexOf(id), 1)
    return this.catalogCollection.doc(catalog.id).set(catalog, { merge: true })
  }
}
