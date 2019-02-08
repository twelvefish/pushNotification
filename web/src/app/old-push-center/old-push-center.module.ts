import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';

import { OldPushCenterRoutingModule } from './old-push-center-routing.module';
import { OldPushCenterComponent } from './old-push-center.component';

import { TreeViewModule } from '@progress/kendo-angular-treeview'
import { GridModule } from '@progress/kendo-angular-grid'
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ChatModule } from '@progress/kendo-angular-conversational-ui'
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { KendoService } from '../controllerServices/kendo/kendo.service'

import { UserService } from '../services/user/user.service'
import { MemberService } from '../services/member/member.service'
import { CatalogService } from '../services/catalog/catalog.service'
import { ChatMessageService } from '../services/chatMessage/chat-message.service'
import { DriveService } from '../services/drive/drive.service'
import { MessageService } from '../services/message/message.service'
import { GroupService } from '../services/group/group.service'
import { ListService } from '../services/list/list.service'

import { CatalogApiService } from '../apiServices/catalogApi/catalog-api.service'
import { GroupApiService } from '../apiServices/groupApi/group-api.service'
import { ListApiService } from '../apiServices/listApi/list-api.service'
import { MessageApiService } from '../apiServices/messageApi/message-api.service'
import { ReviewMessageApiService } from '../apiServices/reviewMessageApi/review-message-api.service'
import { PushMessageApiService } from '../apiServices/pushMessageApi/push-message-api.service'
import { UploadFileApiService } from '../apiServices/uploadFileApi/upload-file-api.service'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OldPushCenterRoutingModule,
    TreeViewModule,
    GridModule,
    DialogsModule,
    ChatModule,
    DateInputsModule
  ],
  declarations: [OldPushCenterComponent],
  providers: [
    UserService,
    MemberService,
    CatalogService,
    ChatMessageService,
    DriveService,
    MessageService,
    GroupService,
    ListService,

    CatalogApiService,
    GroupApiService,
    ListApiService,
    MessageApiService,
    ReviewMessageApiService,
    PushMessageApiService,
    UploadFileApiService,
    KendoService
  ]
})
export class OldPushCenterModule { }
