import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewMessageComponent } from './review-message.component'

const routes: Routes = [
  { path: "", component: ReviewMessageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewMessageRoutingModule { }
