import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore'
import { Observable } from 'rxjs'
import { File } from '../../model'

@Injectable({
  providedIn: 'root'
})
export class DriveService {
  private fileCollection: AngularFirestoreCollection<File>;

  constructor(private database: AngularFirestore) {
    this.fileCollection = database.collection<File>("File", ref => ref.orderBy("sid"));
  }

  getFile(id: string): Observable<any> {
    return this.fileCollection.doc(id).snapshotChanges().pipe(map(document => {
      const data = document.payload.data() as any
      const $key = document.payload.id
      return { ...data, $key }
    }))
  }

  getFolders(): Observable<File[]> {
    let folderFilesPDF = this.database.collection<File>("File", ref => ref.orderBy("sid", "asc"));
    return folderFilesPDF.valueChanges();
  }
}
