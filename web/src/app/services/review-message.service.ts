import { Injectable } from '@angular/core'
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs'
import { ReviewMessage, Receiver } from '../model'

@Injectable({
  providedIn: 'root'
})
export class ReviewMessageService {

  private reviewMessageCollection: AngularFirestoreCollection<any>

  constructor(private database: AngularFirestore) {
    this.reviewMessageCollection = database.collection<ReviewMessage>("ReviewMessage", ref => ref.orderBy("id", "asc"))
  }

  getReviewMessages(): Observable<ReviewMessage[]> {
    return this.reviewMessageCollection.valueChanges();
  }

  getReviewMessageReceiversStartAndEnd(reviewMessageId: string, lastIndex: number): Observable<Receiver[]> {
    console.log(lastIndex)
    const collection = this.reviewMessageCollection.doc(reviewMessageId).collection<Receiver>("Receiver", ref => {
      return ref.orderBy("index")
        .startAfter(lastIndex)
        .limit(10)
    })
    return collection.valueChanges()
  }

  getReviewMessageReceivers(reviewMessageId: string): Observable<Receiver[]> {
    return this.reviewMessageCollection.doc(reviewMessageId).collection<Receiver>("Receiver").valueChanges()
  }

  getReviewMessageById(id: string): Observable<ReviewMessage[]> {
    return this.database.collection<ReviewMessage>("ReviewMessage", ref => ref.where("id", "==", id)).valueChanges()
  }

  getReviewMessageByState(state: number): Observable<ReviewMessage[]> {
    return this.database.collection<ReviewMessage>("ReviewMessage", ref => ref.where("state", ">=", state)).valueChanges()
  }

  getReviewMessageUnProcessed(expectTime: number): Observable<ReviewMessage[]> {
    return this.database.collection<ReviewMessage>("ReviewMessage", ref => ref.where("state", "==", 0).where("expectTime", ">=", expectTime)).valueChanges()
  }

  getReviewMessageOverDue(expectTime: number, type: string): Observable<ReviewMessage[]> {
    return this.database.collection<ReviewMessage>("ReviewMessage", ref => ref.where("state", "==", 0).where("expectTime", "<=", expectTime).where("type", "==", type)).valueChanges()
  }

  getReviewMessageByStateAndUserId(state: number, userId: string): Observable<ReviewMessage[]> {
    return this.database.collection<ReviewMessage>("ReviewMessage", ref => ref.where("state", ">=", state).where("sender.id", "==", userId)).valueChanges()
  }

  getReviewMessageUnProcessedAndUserId(expectTime: number, userId: string): Observable<ReviewMessage[]> {
    return this.database.collection<ReviewMessage>("ReviewMessage", ref => ref.where("state", "==", 0).where("expectTime", ">=", expectTime).where("sender.id", "==", userId)).valueChanges()
  }

  getReviewMessageOverDueAndUserId(expectTime: number, type: string, userId: string): Observable<ReviewMessage[]> {
    return this.database.collection<ReviewMessage>("ReviewMessage", ref => ref.where("state", "==", 0).where("expectTime", "<=", expectTime).where("type", "==", type).where("sender.id", "==", userId)).valueChanges()
  }

}
