import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

import { List } from "../../model"
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private listCollection: AngularFirestoreCollection<List>

  constructor(private database: AngularFirestore) {
    this.listCollection = this.database.collection<List>("List");
  }

  getLists(): Observable<List[]> {
    return this.listCollection.valueChanges();
  }

  getListMessageByOwnerId(ownerId: string): Observable<List[]> {
    return this.database.collection<List>("List", ref => ref.where("ownerId", "==", ownerId)).valueChanges()
  }

  deleteList(id: string): Promise<any> {
    return this.database.collection<List>("List").doc(id).delete()
  }

  updateList(groupMessage: List): Promise<any> {
    return this.database.collection<List>("GroupMessage").doc(groupMessage.id).set(groupMessage, { merge: true })
  }
}
