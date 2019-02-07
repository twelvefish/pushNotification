import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PushCenterRoutingModule } from './push-center-routing.module';
import { PushCenterComponent } from './push-center.component';

@NgModule({
  imports: [
    CommonModule,
    PushCenterRoutingModule
  ],
  declarations: [PushCenterComponent]
})
export class PushCenterModule { }
