import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

import { PushCenterRoutingModule } from './push-center-routing.module';
import { PushCenterComponent } from './push-center.component';
import { MemberComponent } from './member/member.component';
import { MessageComponent } from './message/message.component';

import { TreeViewModule } from '@progress/kendo-angular-treeview'
import { GridModule } from '@progress/kendo-angular-grid'
import { ChatModule } from '@progress/kendo-angular-conversational-ui'
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PushCenterRoutingModule,
    TreeViewModule,
    GridModule,
    ChatModule,
    DialogsModule,
    DateInputsModule
  ],
  declarations: [PushCenterComponent, MemberComponent, MessageComponent]
})
export class PushCenterModule { }
