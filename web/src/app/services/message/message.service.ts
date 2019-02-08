import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs'
import { Message } from '../../model'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageCollection: AngularFirestoreCollection<any>

  constructor(private database: AngularFirestore) {
    this.messageCollection = database.collection<Message>("Message", ref => ref.orderBy("id", "asc"))
  }

  getMessages(): Observable<Message[]> {
    return this.messageCollection.valueChanges();
  }

  getMessageById(id: string): Observable<Message[]> {
    return this.database.collection<Message>("Message", ref => ref.where("id", "==", id)).valueChanges()
  }

  setMessage(messageId: string, messageTitle: string, messageThumb: string, messageContent: string): Promise<any> {
    let message: Message = {
      id: messageId,
      title: messageTitle,
      content: messageContent,
      thumb: messageThumb
    }
    return this.messageCollection.doc(messageId).set(message, { merge: true })
  }

  deleteMessage(messageId: string): Promise<any> {
    return this.messageCollection.doc(messageId).delete()
  }
}
