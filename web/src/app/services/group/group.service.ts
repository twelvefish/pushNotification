import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

import { Group } from "../../model"
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private groupCollection: AngularFirestoreCollection<Group>

  constructor(private database: AngularFirestore) {
    this.groupCollection = this.database.collection<Group>("Group");
  }

  getGroups(): Observable<Group[]> {
    return this.groupCollection.valueChanges();
  }

  getGroupByOwnerId(ownerId: string): Observable<Group[]> {
    return this.database.collection<Group>("Group", ref => ref.where("ownerId", "==", ownerId)).valueChanges()
  }

  getGroupByNameAndOwnerId(groupName: string, ownerId: string): Observable<Group[]> {
    return this.database.collection<Group>("Group", ref => ref.where("name", "==", groupName).where("ownerId", "==", ownerId)).valueChanges()
  }

  deleteGroup(id: string): Promise<any> {
    return this.database.collection<Group>("Group").doc(id).delete()
  }

  updateGroup(group: Group): Promise<any> {
    return this.database.collection<Group>("Group").doc(group.id).set(group, { merge: true })
  }

}
