import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { ReviewMessageRoutingModule } from './review-message-routing.module';
import { ReviewMessageComponent } from './review-message.component';

import { GridModule } from '@progress/kendo-angular-grid';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { DialogsModule } from '@progress/kendo-angular-dialog';

import { ReviewMessageService } from '../services/reviewMessage/review-message.service'
import { ReviewMessageApiService } from '../apiServices/reviewMessageApi/review-message-api.service'

import { GridDetailComponent } from "./grid-detail/grid-detail.component"

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    GridModule,
    ReactiveFormsModule,
    ReviewMessageRoutingModule,
    MultiSelectModule,
    DialogsModule
  ],
  providers: [ReviewMessageService, ReviewMessageApiService],
  declarations: [ReviewMessageComponent, GridDetailComponent]
})
export class ReviewMessageModule { }
