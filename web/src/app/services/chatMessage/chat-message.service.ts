import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";

import { ChatMessage, RecordDetail } from "../../model"
import { Observable } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private chatMessageCollection: AngularFirestoreCollection<ChatMessage>

  constructor(private database: AngularFirestore) {
    this.chatMessageCollection = this.database.collection<ChatMessage>("ChatMessage");
  }

  getChatMessages(): Observable<ChatMessage[]> {
    return this.chatMessageCollection.valueChanges();
  }

  getRecordDetailsByChannelId(channelId: string): Observable<RecordDetail[]> {
    return this.chatMessageCollection.doc(channelId)
      .collection<RecordDetail>("RecordDetail", ref => ref.orderBy("receiveTime", "asc")).valueChanges()
  }

  updateRecordDetailById(id: string, recordDetail: RecordDetail): Promise<any> {
    return this.chatMessageCollection.doc(id)
      .collection("RecordDetail").doc(recordDetail.id)
      .update(recordDetail)
  }

  getRecordDetailsByWechatIdUnRead(wechatId: string): Observable<RecordDetail[]> {
    return this.chatMessageCollection.doc(wechatId)
      .collection<RecordDetail>("RecordDetail", ref => ref.where("read", "==", false).orderBy("receiveTime", "asc")).valueChanges()
  }

  getRecordDetailsByLineIdUnRead(lineId: string): Observable<RecordDetail[]> {
    return this.chatMessageCollection.doc(lineId)
      .collection<RecordDetail>("RecordDetail", ref => ref.where("read", "==", false).orderBy("receiveTime", "asc")).valueChanges()
  }
}
