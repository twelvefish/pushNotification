import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs'
import { User } from '../../model'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<any>

  constructor(private database: AngularFirestore) {
    this.userCollection = database.collection<User>("User", ref => ref.orderBy("name", "asc"))
  }

  getUser(userId: string): Observable<User> {
    return this.userCollection.doc<User>(userId).valueChanges()
  }

  getUsers(): Observable<User[]> {
    return this.userCollection.valueChanges();
  }

  getUserById(id: string): Observable<User[]> {
    return this.database.collection<User>("User", ref => ref.where("id", "==", id)).valueChanges()
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this.database.collection<User>("User", ref => ref.where("email", "==", email)).valueChanges()
  }
}
