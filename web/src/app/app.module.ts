import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { environment } from "src/environments/environment"
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from "angularfire2"
import { AngularFirestoreModule } from "angularfire2/firestore"
import { AngularFireAuthModule } from "angularfire2/auth"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"

import { UserService } from './services/user/user.service'
import { GridModule } from '@progress/kendo-angular-grid';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase, "pushNotification"), //初始化
    AngularFirestoreModule,
    AngularFireAuthModule,
    AppRoutingModule,
    GridModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
