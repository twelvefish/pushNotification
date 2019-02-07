import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewMessageRoutingModule } from './review-message-routing.module';
import { ReviewMessageComponent } from './review-message.component';

@NgModule({
  imports: [
    CommonModule,
    ReviewMessageRoutingModule
  ],
  declarations: [ReviewMessageComponent]
})
export class ReviewMessageModule { }
