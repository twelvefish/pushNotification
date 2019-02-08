import { Component, ElementRef, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { AngularFireAuth } from "angularfire2/auth"
import { Member, Message, KendoNode, File, Catalog, User, Urls, ReviewMessage, Receiver, Uploader } from "../model"
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { SortDescriptor, orderBy } from "@progress/kendo-data-query"
import { DataStateChangeEvent, GridDataResult, GridComponent } from "@progress/kendo-angular-grid"
import { Message as KendoMessage, User as KenndoUser } from '@progress/kendo-angular-conversational-ui';
import { combineLatest, Subscription } from 'rxjs';
import { environment } from "../../environments/environment";
import * as uuid from 'uuid';

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

@Component({
  selector: 'app-old-push-center',
  templateUrl: './old-push-center.component.html',
  styleUrls: ['./old-push-center.component.css']
})
export class OldPushCenterComponent implements OnInit {

  breakLine = /\n/g
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  /**
   * 登入者資訊
   */
  member: User
  memberId: string

  /**
   * 左半邊
   */
  chooseMenu: string = "customerService"
  chooseType: string = "contact"
  /**
  * 成員組織 KendoTree
  */
  contactTree: any[] = []
  contactTreeExpanded = ['0', '0_0']
  unReadTree: any[] = []
  unReadTreeExpanded = []
  pushTree: any[] = []
  pushTreeExpanded = ['0', '0_0']
  groupTree: any[] = []
  groupTreeExpanded = []
  listTree: any[] = []
  listTreeExpanded = []

  staticMessageTree: any[] = []
  staticMessageTreeExpanded = []
  dynamicMessageTree: any[] = []
  dynamicMessageTreeExpanded = []

  fileTree: any[] = [{ id: environment.rootFolderId, text: "文件", type: "root" }]
  fileTreeExpanded = ['0']
  /**
 * 搜尋字串
 */
  searchText: string
  dbMembers: Member[] = []
  gridList: any = null
  //====================================
  /**
   * 右半邊
   */
  chooseRightType: string = ""
  messageType: Catalog['type'] = 'static'
  editBoolean: boolean = false
  editType: string = ""

  menuNodeSelected: any = {}
  selectedFlowMessage: Message
  catalogs: Catalog[] = []
  /**
  * 流程 KendoTree
  */
  flowTree: any[] = []
  //====================================
  /**
   * 中間
   */
  isDialogue: boolean = false
  currentType: string = "Line"
  selectedReceiver: Member
  lineCounts: number = 0
  wechatCounts: number = 0
  /**
  * 發訊
  */
  formatMessage: string = ""
  viewMessage: string = ""
  receivers: any[] = []
  receiversMember: Receiver[] = []
  sendFiles: File[] = []
  channel: string = "Line"
  flexButtonsType: string = ""
  /**
  * kendo 一對一
  */
  bot: KenndoUser = { id: 0 }
  user: KenndoUser = { id: 1 }
  conversation: KendoMessage[] = []
  conversationLine: KendoMessage[] = []
  conversationWechat: KendoMessage[] = []
  /**
  * unSubscription
  */
  selectLineMessageSubscribtion: Subscription = null
  memberSubscription: Subscription = null
  /**
  * 下面
  */
  /**
  * 發訊記錄
  */
  messageRecords: Event[] = []
  gridData: GridDataResult
  /**
   * 訊息記錄詳細
   */
  recordDetail: Event = null
  /**
    * Kendo Grid
    */
  @ViewChild(GridComponent) grid: GridComponent
  sort: Array<SortDescriptor> = [{ field: "timeStamp", dir: "desc" }]
  pageSize = 5
  skip = 0

  showDetail: boolean = false

  listData: GridDataResult
  listDataArray = []
  sortList: Array<SortDescriptor> = []
  pageSizeList = 5
  skipList = 0
  formGroup: FormGroup;
  /**
  * 新增訊息輸入
  */
  selectMessage: Message = null

  /**
  * 已選取名單、檔案
  */
  // pushFiles: any[] = []
  urlsTotal: any[] = []
  persistentUrls: Urls[] = []
  /**
   * 頻道
  */
  isLine: boolean = true
  isWechat: boolean = false
  isSMS: boolean = false
  isEmail: boolean = false
  isAll: boolean = false
  /**
       * 選擇的上傳檔案及類型
       */
  file: any
  fileName: string
  fileUpload: Uploader
  fileType: string = ""

  /**
    * 執行狀態
    */
  updating: boolean = false

  /**
   * 群組
  */
  groupName: string = ""
  /**
   * 不變的tree
   */
  Atree: any[] = []
  Btree: any[] = []
  Ctree: any[] = []
  Dtree: any[] = []

  /** 編輯的人*/
  editMember: any = { name: "收件人", id: "" }

  // 控制Dialog
  openedRemoveDialog: boolean = false

  /**
   * 立即發送 / 預約發送
   */
  dataValue: Date = new Date()
  min: Date = new Date()
  pushType: string = "immediate"

  dialogOpenedDelete: boolean = false
  dialogOpenedSave: boolean = false
  dialogOpenedUpload: boolean = false
  dialogOpenedImport: boolean = false
  dialogDynamicMessage: string = ""
  dialogDynamicTitle: string = ""
  invalidUsersImported: string[] = []
  selectedEvent: any = null

  constructor(
    private router: Router,
    private auth: AngularFireAuth,

    private userService: UserService,
    private memberService: MemberService,
    private catalogService: CatalogService,
    private chatMessageService: ChatMessageService,
    private driveService: DriveService,
    private messageService: MessageService,
    private groupService: GroupService,
    private listService: ListService,

    private catalogApiService: CatalogApiService,
    private groupApiService: GroupApiService,
    private listApiService: ListApiService,
    private messageApiService: MessageApiService,
    private reviewMessageApiService: ReviewMessageApiService,
    private pushMessageApiService: PushMessageApiService,
    private uploadFileApiService: UploadFileApiService,

    public kendoService: KendoService
  ) {
    this.auth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.userService.getUserById(firebaseUser.uid).subscribe(members => {
          this.member = members[0]
          console.log("user", members[0])
          this.templateMessage(this.messageType)
        })
      }
    })
    console.log("===chooseType===", this.chooseType)
    let nodeKendo: KendoNode[] = [{ id: environment.rootFolderId, text: "文件", type: "root" }]
    this.driveService.getFolders().take(1).subscribe(folders => {
      nodeKendo = [{ id: environment.rootFolderId, text: "文件", type: "root" }]
      for (let folder of folders) {
        if (folder.mimeType == "application/vnd.google-apps.folder") {
          nodeKendo.push({
            id: folder.id,
            text: folder.name,
            type: "folder",
            parentId: folder.parents,
            data: folder
          })
        } else {
          nodeKendo.push({
            id: folder.id,
            text: folder.name,
            type: "file",
            parentId: folder.parents,
            data: folder
          })
        }
      }
      this.fileTree = nodeKendo
    })

  }

  ngOnInit() {
    this.selectCustomer()
    // this.selectPushMessage()
  }

  //===左半邊===
  isMenuClass(path: string) {
    return (this.chooseMenu === path) ? 'nav-link active' : 'nav-link '
  }

  isMenuId(path: string) {
    return (this.chooseMenu === path) ? 'navSelected' : ''
  }

  selectCustomer() {
    this.chooseMenu = "customerService"
    this.selectContact()
    this.selectedReceiver = null
  }

  selectPushMessage() {
    this.chooseMenu = "pushService"
    this.selectPush()
  }

  isOrganizeClass(path: string) {
    return (this.chooseType === path) ? 'nav-link active' : 'nav-link '
  }

  isOrganizeId(path: string) {
    return (this.chooseType === path) ? 'navSelected' : ''
  }

  selectContact() {
    if (this.selectLineMessageSubscribtion) {
      this.selectLineMessageSubscribtion.unsubscribe()
    }
    if (this.memberSubscription) {
      this.memberSubscription.unsubscribe()
    }
    this.messageInput = ""
    this.selectedReceiver = null
    this.conversation = []
    this.closeDialogue()
    this.editBoolean = false
    this.chooseType = "contact"
    this.memberService.getMembers().subscribe(members => {
      this.dbMembers = members
      this.contactTree = this.kendoService.toMemberTree(members)
      this.Atree = this.kendoService.toMemberTree(members)
      this.contactTreeExpanded = ['0', '0_0']
    })
  }

  selectUnRead() {
    if (this.selectLineMessageSubscribtion) {
      this.selectLineMessageSubscribtion.unsubscribe()
    }
    if (this.memberSubscription) {
      this.memberSubscription.unsubscribe()
    }
    this.messageInput = ""
    this.selectedReceiver = null
    this.conversation = []
    this.editBoolean = false
    this.closeDialogue()
    this.chooseType = "unRead"
    this.unReadTree = [{ id: "unRead", text: "未讀", type: "root" }]
    this.Btree = [{ id: "unRead", text: "未讀", type: "root" }]
    this.unReadTreeExpanded = []

    this.chatMessageService.getChatMessages().subscribe(chatMessages => {
      let nodeKendo: KendoNode[] = [{ id: "unRead", text: "未讀", type: "root" }]
      if (chatMessages.length == 0) {
        this.unReadTree = nodeKendo
        this.Btree = nodeKendo
      }
      for (let chatMessage of chatMessages) {
        this.chatMessageService.getRecordDetailsByChannelId(chatMessage.id).subscribe(recordDetails => {
          let count = 0
          for (let record of recordDetails) {
            if (!record.read) {
              count++
            }
          }
          if (chatMessage.id.length == environment.idLength.LINE) {
            this.memberService.getMemberByLineId(chatMessage.id).subscribe(member => {
              if (member.length > 0 && (count > 0 || (count == 0 && nodeKendo.map(receiver => receiver.id).indexOf(member[0].id) != -1))) {
                let index = nodeKendo.map(kendo => kendo.id).indexOf(member[0].id)
                if (index == -1) {
                  nodeKendo.push({
                    id: member[0].id,
                    text: member[0].name,
                    type: "member",
                    parentId: "unRead",
                    data: { ...member[0], lineCount: count, wechatCount: 0 }
                  })
                  nodeKendo.push({
                    id: uuid.v4(),
                    text: member[0].mobilePhone,
                    parentId: member[0].id,
                    type: "phone"
                  })
                  nodeKendo.push({
                    id: uuid.v4(),
                    text: member[0].email,
                    parentId: member[0].id,
                    type: "email"
                  })
                  if (member[0].lineId != "empty") {
                    nodeKendo.push({
                      id: member[0].lineId,
                      text: "Line",
                      parentId: member[0].id,
                      type: "line",
                      data: member[0]
                    })
                  }
                  if (member[0].wechatId != "empty") {
                    nodeKendo.push({
                      id: member[0].wechatId,
                      text: "WeChat",
                      parentId: member[0].id,
                      type: "wechat",
                      data: member[0]
                    })
                  }
                } else {
                  nodeKendo[index].data.lineCount = count
                }
                this.unReadTree = nodeKendo
                this.Btree = nodeKendo
              }
            })
          } else if (chatMessage.id.length == environment.idLength.WECHAT) {
            this.memberService.getMemberByWechatId(chatMessage.id).subscribe(member => {
              if (count > 0 || (count == 0 && nodeKendo.map(receiver => receiver.id).indexOf(member[0].id) != -1)) {
                let index = nodeKendo.map(kendo => kendo.id).indexOf(member[0].id)
                if (index == -1) {
                  nodeKendo.push({
                    id: member[0].id,
                    text: member[0].name,
                    type: "member",
                    parentId: "unRead",
                    data: { ...member[0], lineCount: 0, wechatCount: count }
                  })
                } else {
                  nodeKendo[index].data.wechatCount = count
                }
                this.unReadTree = nodeKendo
                this.Btree = nodeKendo
              }
            })
          }
        })
      }
      setTimeout(() => {
        this.unReadTreeExpanded = ['0']
      }, 1000)
    })
  }

  selectPush() {
    this.receivers = []
    this.urlsTotal = []
    this.editBoolean = false
    this.viewMessage = ""
    this.closeDialogue()
    this.memberService.getMembers().subscribe(members => {
      this.pushTree = this.kendoService.toMemberTree(members)
      this.Atree = this.kendoService.toMemberTree(members)
    })
    this.pushTreeExpanded = ['0', '0_0']
    this.chooseType = "push"
  }

  selectGroup() {
    this.receivers = []
    this.urlsTotal = []
    this.editBoolean = false
    this.viewMessage = ""
    this.closeDialogue()
    this.chooseType = "group"
    this.groupTree = [{ id: "group", text: "名單", type: "root" }]
    this.groupService.getGroupByOwnerId(this.member.id).subscribe(groups => {
      let nodeKendo: KendoNode[] = [{ id: "group", text: "名單", type: "root" }]
      if (groups.length > 0) {
        for (let group of groups) {
          nodeKendo.push({
            id: group.id,
            text: group.name,
            type: "org",
            parentId: "group",
            data: group
          })
          if (group.memberId.length > 0) {
            for (var i = 0; i < group.memberId.length; i++) {
              this.memberService.getMemberById(group.memberId[i]).subscribe(members => {
                if (nodeKendo.map(node => node.id).indexOf(group.id + members[0].id) != -1) {
                  nodeKendo.splice(nodeKendo.map(node => node.id).indexOf(group.id + members[0].id), 1)
                }
                if (nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "phone") != -1) {
                  nodeKendo.splice(nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "phone"), 1)
                }
                if (nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "email") != -1) {
                  nodeKendo.splice(nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "email"), 1)
                }
                if (nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "line") != -1) {
                  nodeKendo.splice(nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "line"), 1)
                }
                if (nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "wechat") != -1) {
                  nodeKendo.splice(nodeKendo.map(node => node.id).indexOf(group.id + members[0].id + "wechat"), 1)
                }

                nodeKendo.push({
                  id: group.id + members[0].id,
                  text: members[0].name,
                  type: "member",
                  parentId: group.id,
                  data: members[0]
                })
                nodeKendo.push({
                  id: group.id + members[0].id + "phone",
                  text: members[0].mobilePhone,
                  parentId: group.id + members[0].id,
                  type: "phone"
                })
                nodeKendo.push({
                  id: group.id + members[0].id + "email",
                  text: members[0].email,
                  parentId: group.id + members[0].id,
                  type: "email"
                })
                if (members[0].lineId != "empty") {
                  nodeKendo.push({
                    id: group.id + members[0].id + "line",
                    text: "Line",
                    parentId: group.id + members[0].id,
                    type: "line",
                    data: members[0]
                  })
                }
                if (members[0].wechatId != "empty") {
                  nodeKendo.push({
                    id: group.id + members[0].id + "wechat",
                    text: "WeChat",
                    parentId: group.id + members[0].id,
                    type: "wechat",
                    data: members[0]
                  })
                }

                this.groupTree = nodeKendo
                this.Ctree = nodeKendo
                this.groupTreeExpanded = ['0']
                console.log("this.groupTree", this.groupTree)
              })

            }
          } else {
            this.groupTree = nodeKendo
            this.Ctree = nodeKendo
            this.groupTreeExpanded = ['0']
          }
        }
      }
    })
  }

  selectList() {
    this.gridList = null
    this.listData = null
    this.closeDialogue()
    this.editBoolean = false
    this.chooseType = "list"
    this.listTree = [{ id: "list", text: "批次", type: "root" }]
    this.listService.getListMessageByOwnerId(this.member.id).subscribe(lists => {
      let nodeKendo: KendoNode[] = [{ id: "list", text: "批次", type: "root" }]
      if (lists.length > 0) {
        for (let list of lists) {
          nodeKendo.push({
            id: list.id,
            text: list.name,
            type: "org",
            parentId: "list",
            data: list
          })
        }
        this.listTree = nodeKendo
        this.Dtree = nodeKendo
        this.listTreeExpanded = ['0']
      }
    })
  }

  editedRowIndex: number;

  //kendo grid

  addHandler({ sender }) {
    this.closeEditor(sender);
    this.editMember.name = "收件人"
    this.editMember.id = ""
    this.formGroup = new FormGroup({
      'content': new FormControl('', Validators.required),
      'name': new FormControl('', Validators.required)
      // 'name': new FormControl('')
    });

    sender.addRow(this.formGroup);
  }

  addGroupHandler({ sender }) {
    console.log("this.gridList.data", this.gridList.data)
    this.closeEditor(sender);
    this.editMember.name = "收件人"
    this.editMember.id = ""
    this.formGroup = new FormGroup({
      'name': new FormControl('', Validators.required)
      // 'name': new FormControl('')
    });

    sender.addRow(this.formGroup);
  }

  editHandler({ sender, rowIndex, dataItem }) {
    console.log(dataItem)
    this.closeEditor(sender);
    this.editMember.name = dataItem.name
    this.editMember.id = dataItem.id
    this.formGroup = new FormGroup({
      'content': new FormControl(dataItem.content),
      'id': new FormControl(dataItem.id),
      'name': new FormControl(dataItem.name)
    })
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  editGroupHandler({ sender, rowIndex, dataItem }) {
    console.log(dataItem)
    this.closeEditor(sender);
    this.editMember.name = dataItem.name
    this.editMember.id = dataItem.id
    this.formGroup = new FormGroup({
      'id': new FormControl(dataItem.id),
      'name': new FormControl(dataItem.name)
    })
    this.editedRowIndex = rowIndex;

    sender.editRow(rowIndex, this.formGroup);
  }

  cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  saveHandler({ sender, rowIndex, formGroup, isNew, dataItem }) {
    console.log("new or old", isNew)
    console.log("formGroup", formGroup.value)
    console.log("dataItem", dataItem)
    console.log("this.gridList.data", this.gridList.data)
    this.updating = true
    if (isNew) {
      this.gridList.data.members.push({
        content: dataItem.content,
        id: this.editMember.id,
        name: this.editMember.name
      })
      this.listApiService.updateList(this.gridList.data).then(() => {
        this.editKendoGridList(this.gridList)
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
        console.log("===create new groupMessage success===")
      }).catch(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
      })
    } else {
      dataItem.content = formGroup.value.content
      dataItem.id = formGroup.value.id
      dataItem.name = formGroup.value.name
      this.listApiService.updateList(this.gridList.data).then(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
        console.log("===save groupMessage success===")
      }).catch(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
      })
    }
    sender.closeRow(rowIndex);
  }

  saveGroupHandler({ sender, rowIndex, formGroup, isNew, dataItem }) {
    console.log("new or old", isNew)
    console.log("formGroup", formGroup.value)
    console.log("dataItem", dataItem)
    console.log("listDataArray", this.listDataArray)
    this.updating = true
    if (isNew) {
      this.gridList.data.memberId = this.listDataArray.map(temp => temp.id)
      this.gridList.data.memberId.push(dataItem.id)
      this.groupApiService.updateGroup(this.gridList.data).then(() => {
        this.editKendoGridGroup(this.gridList)
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
        console.log("===create new groupMessage success===")
      }).catch(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
      })
    } else {
      dataItem.id = formGroup.value.id
      this.gridList.data.memberId = this.gridList.data.memberId.map(temp => temp.id)
      this.groupApiService.updateGroup(this.gridList.data).then(() => {
        this.editKendoGridGroup(this.gridList)
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
        console.log("===save Group success===")
      }).catch(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedSave = false
      })
    }
    sender.closeRow(rowIndex);
  }

  removeHandler({ dataItem }) {
    console.log(dataItem)
    console.log(this.listDataArray.map(data => data.id).indexOf(dataItem.id))
    if (this.listDataArray.map(data => data.id).indexOf(dataItem.id) != -1) {
      this.updating = true
      this.listDataArray.splice(this.listDataArray.map(data => data.id).indexOf(dataItem.id), 1)
      this.gridList.data.members = this.listDataArray
      this.listApiService.updateList(this.gridList.data).then(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedDelete = false
      }).catch(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedDelete = false
      })
      this.filterMessageList()
    }
  }

  removeGroupHandler({ dataItem }) {
    console.log(dataItem)
    console.log(this.listDataArray.map(data => data.id).indexOf(dataItem.id))
    if (this.listDataArray.map(data => data.id).indexOf(dataItem.id) != -1) {
      this.updating = true
      this.listDataArray.splice(this.listDataArray.map(data => data.id).indexOf(dataItem.id), 1)
      this.gridList.data.memberId = this.listDataArray.map(data => data.id)
      this.groupApiService.updateGroup(this.gridList.data).then(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedDelete = false
      }).catch(() => {
        this.editMember = { name: '', id: '' }
        this.updating = false
        this.dialogOpenedDelete = false
      })
      this.filterMessageList()
    }
  }

  closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.formGroup = undefined;
  }

  // 名單新增刪除編輯

  checkChooseMember() {
    console.log("this.formGroup", this.formGroup)
    this.formGroup.value.name = this.editMember.name
    this.formGroup.value.id = this.editMember.id
  }

  async editKendoGridGroup(dataItem: any) {
    console.log("dataItem", dataItem)
    this.editMember = { name: '', id: '' }
    this.editBoolean = true
    this.gridList = dataItem
    let datas = []
    for (let id of dataItem.data.memberId) {
      console.log("id", id)
      let temp: Member = await this.memberService.getMemberByIdPromise(id)
      console.log("temp", temp)
      datas.push({ id: id, name: temp.name })
    }
    dataItem.data.memberId = datas
    this.listDataArray = dataItem.data.memberId
    this.filterMessageList()
  }

  // 批次新增刪除編輯
  async chooseKendoData(dataItem: any) {
    this.editBoolean = false
    this.gridList = dataItem
    this.viewMessage = "{{message}}"
    let datas = []
    let receiver = []
    for (let data of dataItem.data.members) {
      let temp = await this.memberService.getMemberByIdPromise(data.id)
      temp = { ...temp, data: [{ message: data.content }] }
      receiver.push({ data: temp })
      datas.push({ ...data, name: temp.name })
    }
    this.receivers = receiver
    dataItem.data.members = datas
    this.listDataArray = dataItem.data.members
    this.filterMessageList()
  }

  async editKendoGridList(dataItem: any) {
    console.log("dataItem", dataItem)
    this.editMember = { name: '', id: '' }
    this.editBoolean = true
    this.gridList = dataItem
    let datas = []
    for (let data of dataItem.data.members) {
      let temp = await this.memberService.getMemberByIdPromise(data.id)
      temp = { ...temp, data: [{ message: data.content }] }
      datas.push({ ...data, name: temp.name })
    }
    dataItem.data.members = datas
    this.listDataArray = dataItem.data.members
    this.filterMessageList()
  }

  deleteList() {
    this.updating = true
    this.listApiService.deleteList(this.gridList.id).then(() => {
      this.updating = false
      this.listDataArray = []
      this.listData = { data: [], total: 0 }
      this.groupName = ''
      this.selectList()
    })
  }


  deleteGroup() {
    this.updating = true
    this.groupApiService.deleteGroup(this.gridList.id).then(() => {
      this.updating = false
      this.listDataArray = []
      this.listData = { data: [], total: 0 }
      this.groupName = ''
      this.selectGroup()
    })
  }


  filterMessageList() {
    this.listData = {
      data: orderBy(this.listDataArray, this.sortList),//.slice(this.skipList, this.listDataArray.length),
      total: this.listDataArray.length
    }
  }

  onMessageRecordStateChangeList({ skip, take, sort }: DataStateChangeEvent): void {
    this.skipList = skip
    this.pageSizeList = take
    this.sortList = sort
    this.filterMessageList()
  }

  pushMember(dataItem: any) {
    console.log("dataItem", dataItem)
    let memberId = dataItem.data.id
    if (this.receivers.map(receive => receive.data.id === memberId).indexOf(true) === -1) {
      this.receivers.push(dataItem)
    } else {
      this.receivers.splice(this.receivers.map(receive => receive.data.id).indexOf(memberId), 1)
    }
  }

  pushMembers(dataItem: any) {
    console.log(dataItem)
    let members = []
    for (let member of this.pushTree) {
      if (member.parentId == dataItem.id) {
        members.push(member)
      }
    }
    let memberOf = members.filter(member => {
      return this.receivers.map(receiver => receiver.data.id).indexOf(member.data.id) == -1
    })
    if (memberOf.length > 0) {
      for (let member of memberOf) {
        this.receivers.push(member)
      }
    } else {
      this.receivers = this.receivers.filter(receiver => { return members.map(member => member.data.id).indexOf(receiver.data.id) == -1 })
    }
  }

  pushTotalMembers(dataItem: any) {
    let members = []
    for (let member of this.Atree) {
      if (member.data && member.data.division == dataItem.text && member.type == 'member') {
        members.push(member)
      }
    }
    let memberOf = members.filter(member => {
      return this.receivers.map(receiver => receiver.data.id).indexOf(member.data.id) == -1
    })
    if (memberOf.length > 0) {
      for (let member of memberOf) {
        this.receivers.push(member)
      }
    } else {
      this.receivers = this.receivers.filter(receiver => { return members.map(member => member.data.id).indexOf(receiver.data.id) == -1 })
    }
  }

  pushMembersOfGroup(dataItem: any) {
    this.editBoolean = false
    let members = []
    for (let member of this.groupTree) {
      if (member.parentId == dataItem.id) {
        members.push(member)
      }
    }
    let memberOf = members.filter(member => {
      return this.receivers.map(receiver => receiver.data.id).indexOf(member.data.id) == -1
    })
    if (memberOf.length > 0) {
      for (let member of memberOf) {
        this.receivers.push(member)
      }
    } else {
      this.receivers = this.receivers.filter(receiver => { return members.map(member => member.data.id).indexOf(receiver.data.id) == -1 })
    }
  }

  checkReceivers(dataItem: any) {
    return this.receivers.map(receiver => receiver.data.id).indexOf(dataItem.data.id) !== -1
  }

  getMemberRecord(receiver: KendoNode) {

    console.log(receiver)
    this.conversation = []
    this.selectedReceiver = receiver.data

    if (receiver.type == 'wechat') {
      this.currentType = 'WeChat'
    } else {
      this.currentType = 'Line'
    }

    this.bot.name = receiver.data.name
    this.user.name = this.member.name
    if (this.selectLineMessageSubscribtion) {
      this.selectLineMessageSubscribtion.unsubscribe()
    }
    if (this.memberSubscription) {
      this.memberSubscription.unsubscribe()
    }

    this.memberSubscription = this.memberService.getMember(receiver.data.id).subscribe(member => {
      this.selectLineMessageSubscribtion = combineLatest(this.chatMessageService.getRecordDetailsByChannelId(member.lineId), this.chatMessageService.getRecordDetailsByChannelId(member.wechatId)).subscribe(([lineRecords, wechatRecords]) => {
        console.log("lineRecords", lineRecords)
        console.log("wechatRecords", wechatRecords)
        let messagesLine: KendoMessage[] = []
        let messagesWechat: KendoMessage[] = []

        let lineCounts = 0
        let wechatCounts = 0
        for (let lineRecord of lineRecords) {
          if (!lineRecord.read) {
            lineCounts++
          }
          if (lineRecord.receiver.id == "system") {
            if (lineRecord.urls) {
              let attachments: any[] = []
              lineRecord.urls.forEach(url => {
                attachments.push({
                  content: url.name,
                  id: url.url
                })
              })
              messagesLine.push({
                author: this.bot,
                text: lineRecord.message.replace(/\\n/g, "\n"),
                attachmentLayout: 'carousel',
                attachments: attachments,
                timestamp: new Date(lineRecord.receiveTime)
              })
            } else {
              messagesLine.push({
                author: this.bot,
                text: lineRecord.message.replace(/\\n/g, "\n"),
                timestamp: new Date(lineRecord.receiveTime)
              })
            }
          } else {
            if (lineRecord.urls) {
              let attachments: any[] = []
              lineRecord.urls.forEach(url => {
                attachments.push({
                  content: url.name,
                  id: url.url
                })
              })
              messagesLine.push({
                author: this.user,
                text: lineRecord.message.replace(/\\n/g, "\n"),
                attachmentLayout: 'carousel',
                attachments: attachments,
                timestamp: new Date(lineRecord.receiveTime)
              })
            } else {
              messagesLine.push({
                author: this.user,
                text: lineRecord.message.replace(/\\n/g, "\n"),
                timestamp: new Date(lineRecord.receiveTime)
              })
            }
          }
        }
        console.log("messagesLine", messagesLine)
        this.lineCounts = lineCounts

        for (let wechatRecord of wechatRecords) {
          if (!wechatRecord.read) {
            wechatCounts++
          }

          if (wechatRecord.receiver.id == "system") {
            if (wechatRecord.urls) {
              let attachments: any[] = []
              wechatRecord.urls.forEach(url => {
                attachments.push({
                  content: url.name,
                  id: url.url
                })
              })
              messagesWechat.push({
                author: this.bot,
                text: wechatRecord.message.replace(/\\n/g, "\n"),
                attachmentLayout: 'carousel',
                attachments: attachments,
                timestamp: new Date(wechatRecord.receiveTime)
              })
            } else {
              messagesWechat.push({
                author: this.bot,
                text: wechatRecord.message.replace(/\\n/g, "\n"),
                timestamp: new Date(wechatRecord.receiveTime)
              })
            }
          } else {
            if (wechatRecord.urls) {
              let attachments: any[] = []
              wechatRecord.urls.forEach(url => {
                attachments.push({
                  content: url.name,
                  id: url.url
                })
              })
              messagesWechat.push({
                author: this.user,
                text: wechatRecord.message.replace(/\\n/g, "\n"),
                attachmentLayout: 'carousel',
                attachments: attachments,
                timestamp: new Date(wechatRecord.receiveTime)
              })
            } else {
              messagesWechat.push({
                author: this.user,
                text: wechatRecord.message.replace(/\\n/g, "\n"),
                timestamp: new Date(wechatRecord.receiveTime)
              })
            }
          }
        }
        this.wechatCounts = wechatCounts

        this.conversationLine = messagesLine
        this.conversationWechat = messagesWechat

        if (this.currentType == 'Line') {
          this.selectLine()
        } else if (this.currentType == 'WeChat') {
          this.selectWeChat()
        }

        this.isDialogue = true
      })
    })
  }

  uploadFile(event: any) {
    console.log("event", event)
    this.file = event
    this.fileName = event.target.files[0].name
    this.fileUpload = new Uploader(event.target.files.item(0))
    this.fileType = this.fileUpload.file.name.substring(this.fileUpload.file.name.lastIndexOf(".") + 1, this.fileUpload.file.name.length)
    // this.groupName = this.fileName.substring(0, this.fileName.lastIndexOf("."))
  }

  importMemberAndMessageList(type: "group" | "batchGroup") {
    this.fileName = ""
    this.updating = true
    if (this.file) {
      this.uploadFileApiService.importGroupMember(this.groupName, this.member.id, this.file, type).then(() => {
        this.updating = false
        this.groupName = ""
        this.file = null
        this.editBoolean = false
      }).catch(err => {
        if (err.error.hasOwnProperty('invalidUsers')) {
          this.dialogDynamicMessage = "名單資料有誤！請檢查以下資料："
          console.log("upload Group Member failed---", err.error.invalidUsers)
          this.invalidUsersImported = err.error.invalidUsers
        } else { this.dialogDynamicMessage = "匯入失敗！請檢查檔案內容。" }
        this.dialogOpenedImport = true
        this.updating = false
        this.groupName = ""
        this.file = null
        this.editBoolean = false
      })
    }
  }

  filterSearch() {
    if (this.chooseType == "contact") {
      this.contactTree = this.filterSearchTree(this.Atree)
      if (this.searchText) {
        this.contactTree.push({
          id: "search",
          text: "客服",
          type: "root"
        })
      }

    } else if (this.chooseType == "unRead") {
      this.unReadTree = this.filterSearchTree(this.Btree)
      if (this.searchText) {
        this.unReadTree.push({
          id: "search",
          text: "未讀",
          type: "root"
        })
      }
    } else if (this.chooseType == "push") {
      this.pushTree = this.filterSearchTree(this.Atree)
      if (this.searchText) {
        this.pushTree.push({
          id: "search",
          text: "組織",
          type: "root"
        })
      }
    } else if (this.chooseType == "group") {
      // this.groupTree = this.filterSearchTree(this.Ctree)
      // if (this.searchText) {
      //     this.groupTree.push({
      //         id: "search",
      //         text: "名單",
      //         type: "root"
      //     })
      // }
      if (this.searchText) {
        let nodeKendo: KendoNode[] = [{ id: "search", text: "名單", type: "root" }]
        for (let kendoData of this.Ctree) {
          if (kendoData.type == 'member') {
            Object.keys(kendoData.data).map(key => {
              if (String(kendoData.data[key]).indexOf(this.searchText) != -1) {
                if (nodeKendo.map(node => node.id).indexOf(kendoData.data.id) == -1) {
                  nodeKendo.push({
                    id: kendoData.data.id,
                    text: kendoData.data.name,
                    type: "member",
                    parentId: "search",
                    data: kendoData.data
                  })
                  nodeKendo.push({
                    id: uuid.v4(),
                    text: kendoData.data.mobilePhone,
                    parentId: kendoData.data.id,
                    type: "phone"
                  })
                  nodeKendo.push({
                    id: uuid.v4(),
                    text: kendoData.data.email,
                    parentId: kendoData.data.id,
                    type: "email"
                  })
                  if (kendoData.data.lineId != "empty") {
                    nodeKendo.push({
                      id: kendoData.data.lineId,
                      text: "Line",
                      parentId: kendoData.data.id,
                      type: "line",
                      data: kendoData.data
                    })
                  }
                  if (kendoData.data.wechatId != "empty") {
                    nodeKendo.push({
                      id: kendoData.data.wechatId,
                      text: "WeChat",
                      parentId: kendoData.data.id,
                      type: "wechat",
                      data: kendoData.data
                    })
                  }
                  if (kendoData.data.lineGroup && kendoData.data.lineGroup.length > 0) {
                    const lineGroupNode: KendoNode = {
                      id: kendoData.data.id + "lineGroup",
                      text: "群組",
                      parentId: kendoData.data.id,
                      type: "lineGroup",
                    }
                    nodeKendo.push(lineGroupNode)
                    kendoData.data.lineGroup.forEach(group => {
                      nodeKendo.push({
                        id: group.groupId,
                        text: group.name,
                        parentId: kendoData.data.id + "lineGroup",
                        type: "group",
                        data: group
                      })
                    })
                  }
                }
              }
            })
          } else if (kendoData.type == 'org') {
            Object.keys(kendoData.data).map(key => {
              console.log("key", key)
              if (key == 'name' && String(kendoData.data[key]).indexOf(this.searchText) != -1) {
                if (nodeKendo.map(node => node.id).indexOf(kendoData.data.id) == -1) {
                  nodeKendo.push({
                    id: kendoData.data.id,
                    text: kendoData.data.name,
                    type: "org",
                    parentId: "search",
                    data: kendoData.data
                  })
                  for (var i = 0; i < kendoData.data.memberId.length; i++) {
                    this.memberService.getMemberByIdPromise(kendoData.data.memberId[i]).then(member => {
                      nodeKendo.push({
                        id: kendoData.data.id + member.id,
                        text: member.name,
                        type: "member",
                        parentId: kendoData.data.id,
                        data: member
                      })
                      nodeKendo.push({
                        id: kendoData.data.id + member.id + "phone",
                        text: member.mobilePhone,
                        parentId: kendoData.data.id + member.id,
                        type: "phone"
                      })
                      nodeKendo.push({
                        id: kendoData.data.id + member.id + "email",
                        text: member.email,
                        parentId: kendoData.data.id + member.id,
                        type: "email"
                      })
                    })
                  }
                }
              }
            })
          }
        }
        if (nodeKendo.length == 1) {
          nodeKendo.push({
            id: "none",
            text: "找無匹配成員",
            type: "org",
            parentId: "search",
            data: {
              id: "none"
            }
          })
          this.groupTree = nodeKendo
        } else {
          this.groupTree = nodeKendo
        }
      } else {
        this.groupTree = this.Ctree
      }
    } else if (this.chooseType == "list") {
      if (this.searchText) {
        let nodeKendo: KendoNode[] = [{ id: "search", text: "批次", type: "root" }]
        for (let node of this.Dtree) {
          if ((node.text as String).indexOf(this.searchText) != -1) {
            nodeKendo.push(node)
          }
        }
        if (nodeKendo.length == 1) {
          nodeKendo.push({
            id: "none",
            text: "找無匹配成員",
            type: "org",
            parentId: "search",
            data: {
              id: "none"
            }
          })
          this.listTree = nodeKendo
        } else {
          this.listTree = nodeKendo
        }
      } else {
        this.listTree = this.Dtree
      }
    }
  }

  filterSearchTree(kendoTree: any): any[] {
    console.log("kendoTree")
    let nodeKendo: KendoNode[] = []
    if (this.searchText) {
      for (let kendoData of kendoTree) {
        if (kendoData.type == "member") {
          Object.keys(kendoData.data).map(key => {
            if (String(kendoData.data[key]).indexOf(this.searchText) != -1) {
              if (nodeKendo.map(node => node.id).indexOf(kendoData.data.id) == -1) {
                nodeKendo.push({
                  id: kendoData.data.id,
                  text: kendoData.data.name,
                  type: "member",
                  parentId: "search",
                  data: kendoData.data
                })
                nodeKendo.push({
                  id: uuid.v4(),
                  text: kendoData.data.mobilePhone,
                  parentId: kendoData.data.id,
                  type: "phone"
                })
                nodeKendo.push({
                  id: uuid.v4(),
                  text: kendoData.data.email,
                  parentId: kendoData.data.id,
                  type: "email"
                })
                if (kendoData.data.lineId != "empty") {
                  nodeKendo.push({
                    id: kendoData.data.lineId,
                    text: "Line",
                    parentId: kendoData.data.id,
                    type: "line",
                    data: kendoData.data
                  })
                }
                if (kendoData.data.wechatId != "empty") {
                  nodeKendo.push({
                    id: kendoData.data.wechatId,
                    text: "WeChat",
                    parentId: kendoData.data.id,
                    type: "wechat",
                    data: kendoData.data
                  })
                }
                if (kendoData.data.lineGroup && kendoData.data.lineGroup.length > 0) {
                  const lineGroupNode: KendoNode = {
                    id: kendoData.data.id + "lineGroup",
                    text: "群組",
                    parentId: kendoData.data.id,
                    type: "lineGroup",
                  }
                  nodeKendo.push(lineGroupNode)
                  kendoData.data.lineGroup.forEach(group => {
                    nodeKendo.push({
                      id: group.groupId,
                      text: group.name,
                      parentId: kendoData.data.id + "lineGroup",
                      type: "group",
                      data: group
                    })
                  })
                }
              }
            }
          })
        }
      }
      if (nodeKendo.length == 0 && this.searchText != '') {
        nodeKendo.push({
          id: "none",
          text: "找無匹配成員",
          type: "member",
          parentId: "search",
          data: {
            id: "none"
          }
        })
        kendoTree = nodeKendo
      } else {
        kendoTree = nodeKendo
      }
    }
    return kendoTree
  }

  //===右半邊===
  templateMessage(type: Catalog['type']) {
    this.messageType = type
    this.editBoolean = false
    this.chooseCatalog = null
    if (type == 'static') {
      this.catalogService.getCatalogByTypeAndUserId(type, this.member.id).subscribe(catalogs => {
        this.catalogs = catalogs
        if (!this.chooseCatalog) {
          this.selectCatalog(this.catalogs[0])
        }
      })
    } else {
      this.catalogService.getCatalogByType(type).subscribe(catalogs => {
        this.catalogs = catalogs
        if (!this.chooseCatalog) {
          this.selectCatalog(this.catalogs[0])
        }
      })
    }
  }

  isMessageClass(path: string) {
    return (this.chooseRightType === path) ? 'nav-link active' : 'nav-link '
  }

  isMessageId(path: string) {
    return (this.chooseRightType === path) ? 'navSelected' : ''
  }

  // 選擇目錄
  selectCatalog(catalog: Catalog) {
    if (catalog) {
      this.chooseRightType = catalog.name
      this.chooseCatalog = catalog
      this.staticMessageTree = []
      this.staticMessageTreeExpanded = []
      this.dynamicMessageTree = []
      this.dynamicMessageTreeExpanded = []

      if (catalog.type == 'dynamic') {
        let nodeKendo: KendoNode[] = [{ id: "message", text: "訊息", type: "root", data: { title: '', content: '' } }]
        if (catalog.messageId.length == 0) {
          this.dynamicMessageTree = nodeKendo
        }
        for (let messageId of catalog.messageId) {
          this.messageService.getMessageById(messageId).subscribe(messages => {
            if (messages[0]) {
              this.dynamicMessageTreeExpanded = []
              if (nodeKendo.map(nodeKendo => nodeKendo.id).indexOf(messages[0].id) != -1) {
                nodeKendo.splice(nodeKendo.map(nodeKendo => nodeKendo.id).indexOf(messages[0].id), 1)
              }
              nodeKendo.push({
                id: messages[0].id,
                text: messages[0].title,
                type: "message",
                parentId: "message",
                data: messages[0]
              })
              this.dynamicMessageTree = nodeKendo
              setTimeout(() => {
                this.dynamicMessageTreeExpanded = ['0']
              }, 500);
            }
          })
        }
      } else if (catalog.type == 'static') {
        let nodeKendo: KendoNode[] = [{ id: "message", text: "訊息", type: "root", data: { title: '', content: '' } }]
        if (catalog.messageId.length == 0) {
          this.staticMessageTree = nodeKendo
        }
        for (let messageId of catalog.messageId) {
          this.messageService.getMessageById(messageId).subscribe(messages => {
            if (messages[0]) {
              this.staticMessageTreeExpanded = []
              if (nodeKendo.map(nodeKendo => nodeKendo.id).indexOf(messages[0].id) != -1) {
                nodeKendo.splice(nodeKendo.map(nodeKendo => nodeKendo.id).indexOf(messages[0].id), 1)
              }
              nodeKendo.push({
                id: messages[0].id,
                text: messages[0].title,
                type: "message",
                parentId: "message",
                data: messages[0]
              })
              this.staticMessageTree = nodeKendo
              setTimeout(() => {
                this.staticMessageTreeExpanded = ['0']
              }, 500);
            }
          })
        }
      }
    }
  }


  // 新增目錄
  createCatalogInterface() {
    this.editBoolean = true
    this.editType = "createCatalog"
  }

  createCatalog(catalogName: string) {
    this.updating = true
    this.catalogApiService.createCatalog(catalogName, this.messageType, this.member.id).then(() => {
      this.editBoolean = false
      this.updating = false
      console.log("===create Catalog success===")
    }).catch(err => {
      this.updating = false
    })
  }

  editCatalogName: string
  saveCatalog() {
    this.updating = true
    this.chooseCatalog.name = this.editCatalogName
    this.catalogApiService.updateCatalog(this.chooseCatalog).then(() => {
      this.editBoolean = false
      this.updating = false
      console.log("===Update Catalog success===")
    }).catch(err => {
      this.updating = false
    })
  }

  deleteCatalog() {
    this.updating = true
    this.catalogApiService.deleteCatalog(this.chooseCatalog.id).then(() => {
      this.editBoolean = false
      this.updating = false
      this.chooseCatalog = null
      this.templateMessage(this.messageType)
      console.log("===Delete Catalog success===")
    }).catch(err => {
      this.templateMessage(this.messageType)
      this.updating = false
    })
  }

  //新增訊息
  createDynamicMessage(messageTitle: string, messageThumb: string, messageContent: string) {
    let messageId = uuid.v4()
    this.editBoolean = false
    this.updating = true
    this.messageApiService.updateTemplate(messageId, messageTitle, messageThumb, messageContent).then(() => {
      this.catalogApiService.setCatalogMessageId(this.chooseCatalog, messageId).then(() => {
        this.selectCatalog(this.chooseCatalog)
        this.updating = false
        console.log("===create Dynamic Message success===")
      }).catch(err => {
        this.updating = false
      })
    }).catch(err => {
      this.updating = false
    })
  }

  createStaticMessage(messageTitle: string, messageContent: string) {
    let messageId = uuid.v4()
    this.editBoolean = false
    this.updating = true
    this.messageApiService.updateTemplate(messageId, messageTitle, "", messageContent).then(() => {
      this.catalogApiService.setCatalogMessageId(this.chooseCatalog, messageId).then(() => {
        this.selectCatalog(this.chooseCatalog)
        this.updating = false
        console.log("===create Static Message success===")
      }).catch(err => {
        this.updating = false
      })
    }).catch(err => {
      this.updating = false
    })
  }

  //編輯訊息
  editDynamicMessage(messageTitle: string, messageThumb: string, messageContent: string) {
    this.editBoolean = false
    this.updating = true
    this.messageApiService.updateTemplate(this.selectMessage.id, messageTitle, messageThumb, messageContent).then(() => {
      this.selectCatalog(this.chooseCatalog)
      this.updating = false
      console.log("===edit Dynamic Message success===")
    }).catch(err => {
      this.updating = false
    })
  }

  editStaticMessage(messageTitle: string, messageContent: string) {
    this.editBoolean = false
    this.updating = true
    this.messageApiService.updateTemplate(this.selectMessage.id, messageTitle, "", messageContent).then(() => {
      this.selectCatalog(this.chooseCatalog)
      this.updating = false
      console.log("===edit Static Message success===")
    }).catch(err => {
      this.updating = false
    })
  }

  //刪除訊息
  deleteMessage() {
    this.editBoolean = false
    this.updating = true
    this.catalogApiService.deleteCatalogMessageId(this.chooseCatalog, this.selectMessage.id).then(() => {
      this.messageApiService.deleteTemplate(this.selectMessage.id).then(() => {
        this.selectCatalog(this.chooseCatalog)
        this.updating = false
        console.log("===delete Message success===")
      }).catch(err => {
        this.updating = false
      })
    }).catch(err => {
      this.updating = false
    })
  }

  chooseCatalog: Catalog = null

  chooseMessage(message: Message) {
    console.log("message", message)
    this.editBoolean = false
    this.viewMessage = message.content
    this.messageInput = message.content
  }

  uploadPersistentFile(event: any) {
    console.log(event)
    const fileName = new Uploader(event.target.files.item(0)).file.name
    this.updating = true
    this.uploadFileApiService.importFile(fileName, "persistent", event).then(data => {
      this.updating = false
      let fileUrl = data.url
      if (this.persistentUrls.map(file => file.url).indexOf(fileUrl) == -1) {
        this.persistentUrls.push({ name: fileName, url: fileUrl })
      }
    }).catch(err => {
      this.dialogDynamicTitle = "檔案上傳"
      this.dialogDynamicMessage = "檔案上傳失敗！請檢查檔案是否小於15MB或檔案為系統所支援的類型。"
      this.dialogOpenedUpload = true
      this.updating = false
      console.log("upload Persistent File failed---", err)
    })
  }

  removePersistent(data: any) {
    if (this.persistentUrls.map(files => files.url).indexOf(data.url) != -1) {
      this.persistentUrls.splice(this.persistentUrls.map(file => file.url).indexOf(data.url), 1)
    }
    console.log("this.persistentUrls", this.persistentUrls)
  }

  editFlowMessage() {
    // const newMessage: Message = {
    //    id: this.selectedFlowMessage.id,
    //    title: this.messageTitle,
    //    content: this.messageContent,
    //    thumb: ""
    // }
    // this.eventService.editMessage(newMessage).then(() => {
    //    this.messageTitle = ""
    //    this.messageContent = ""
    //    // this.pushFiles = []
    //    this.persistentUrls = []
    // })
  }

  selectedIcon(fileName: string, ext: string) {
    return new RegExp(`.${ext}\$`).test(fileName) // 判斷icon
  }

  iconClassFolder(data: any) {
    return {
      'k-i-file-pdf': this.selectedIcon(data.fullName, 'pdf'),
      'k-i-html': this.selectedIcon(data.fullName, 'html'),
      'k-i-image': this.selectedIcon(data.fullName, 'jpg|png'),
      'k-i-file-ppt': this.selectedIcon(data.fullName, 'ppt|pptx'),
      'k-i-word': this.selectedIcon(data.fullName, 'doc|docx|txt'),
      'k-i-video-external': this.selectedIcon(data.fullName, 'mp4|m4a'),
      'k-i-file-excel': this.selectedIcon(data.fullName, 'csv') || data.mimeType === 'application/vnd.google-apps.spreadsheet',
      'k-i-folder': data.mimeType === 'application/vnd.google-apps.folder',
      'k-i-list-unordered': this.selectedIcon(data.fullName, '') && data.mimeType !== 'application/vnd.google-apps.folder' && !this.selectedIcon(data.fullName, 'jpg|png'),
      'k-icon': true
    }
  }

  view(id: string) {
    this.router.navigate([`/pdf/` + id]);
  }

  pushFile(dataItem: any) {
    if (this.persistentUrls.map(file => file.name == dataItem.data.fullName).indexOf(true) === -1) {
      if (dataItem.data.mimeType.indexOf("image") != -1) {
        let fileSSOurl = environment.domainName + "getFile?fileId=" + dataItem.data.id
        //  let fileSSOurl = environment.fileServerUrl

        //  for (let i = 1; i < dataItem.data.parentsName.length; i++) {
        //      fileSSOurl += dataItem.data.parentsName[i].fullName
        //      fileSSOurl += "/"
        //  }
        //  fileSSOurl += dataItem.data.fullName

        //  fileSSOurl = fileSSOurl.replace(/\+/g, '%2B')
        //  fileSSOurl = fileSSOurl.replace(/\&/g, '%26')
        //  fileSSOurl = encodeURI(fileSSOurl)

        this.persistentUrls.push({ name: dataItem.data.fullName, url: fileSSOurl })
      } else {
        this.persistentUrls.push({ name: dataItem.data.fullName, url: environment.hostName + 'pdf/' + dataItem.data.id })
      }

    } else {
      this.persistentUrls.splice(this.persistentUrls.map(file => file.name).indexOf(dataItem.data.fullName), 1)
    }
  }

  checkFile(dataItem: any) {
    return this.persistentUrls.map(file => file.name).indexOf(dataItem.data.fullName) !== -1
  }

  selectUrlTotal() {
    this.urlsTotal = this.persistentUrls
    this.persistentUrls = []
  }

  //正中間
  channelDialogueClass(path: string) {
    return (this.currentType === path) ? 'nav-link active' : 'nav-link '
  }

  channelDialogueId(path: string) {
    return (this.currentType === path) ? 'navSelected' : ''
  }

  closeDialogue() {
    this.searchText = ""

    this.isDialogue = false
    if (this.selectLineMessageSubscribtion) {
      this.selectLineMessageSubscribtion.unsubscribe()
    }
    if (this.memberSubscription) {
      this.memberSubscription.unsubscribe()
    }
  }

  saveContentsToDialogue(e: any) {

    if (e.key === "Enter") {
      console.log("e", e.target.value)
      if (this.currentType == 'Line') {
        this.pushMessageApiService.replyMessageNew(this.member, this.selectedReceiver, "Line", e.target.value).then(() => {
          e.target.value = ""
        }).catch(err => {
          this.dialogDynamicTitle = "發送失敗"
          this.dialogDynamicMessage = `${this.currentType}訊息發送失敗失敗！`
          this.dialogOpenedUpload = true
        })
      } else if (this.currentType == 'WeChat') {
        this.pushMessageApiService.replyMessageNew(this.member, this.selectedReceiver, "WeChat", e.target.value).then(() => {
          e.target.value = ""
        }).catch(err => {
          this.dialogDynamicTitle = "發送失敗"
          this.dialogDynamicMessage = `${this.currentType}訊息發送失敗失敗！您只能在對方最後一次使用公眾號之後2天內使用客服功能。`
          this.dialogOpenedUpload = true
        })
      }
    }
  }

  messageInput: string = ""
  saveContentsToDialogueByValue() {
    if (this.currentType == 'Line') {
      this.pushMessageApiService.replyMessageNew(this.member, this.selectedReceiver, "Line", this.messageInput).then(() => {
        this.messageInput = ""
      }).catch(err => {
        this.dialogDynamicTitle = "發送失敗"
        this.dialogDynamicMessage = `${this.currentType}訊息發送失敗失敗！`
        this.dialogOpenedUpload = true
      })
    } else if (this.currentType == 'WeChat') {
      this.pushMessageApiService.replyMessageNew(this.member, this.selectedReceiver, "WeChat", this.messageInput).then(() => {
        this.messageInput = ""
      }).catch(err => {
        this.dialogDynamicTitle = "發送失敗"
        this.dialogDynamicMessage = `${this.currentType}訊息發送失敗失敗！您只能在對方最後一次使用公眾號之後2天內使用客服功能。`
        this.dialogOpenedUpload = true
      })
    }
  }

  sendUrls() {
    if (this.currentType == 'Line') {
      this.pushMessageApiService.replyMessageNew(this.member, this.selectedReceiver, "Line", "", this.persistentUrls).then(() => {
        this.persistentUrls = []
      }).catch(err => {
        this.dialogDynamicTitle = "發送失敗"
        this.dialogDynamicMessage = `${this.currentType}訊息發送失敗失敗！`
        this.dialogOpenedUpload = true
      })
    } else if (this.currentType == 'WeChat') {
      this.pushMessageApiService.replyMessageNew(this.member, this.selectedReceiver, "WeChat", "", this.persistentUrls).then(() => {
        this.persistentUrls = []
      }).catch(err => {
        this.dialogDynamicTitle = "發送失敗"
        this.dialogDynamicMessage = `${this.currentType}訊息發送失敗失敗！您只能在對方最後一次使用公眾號之後2天內使用客服功能。`
        this.dialogOpenedUpload = true
      })
    }
  }

  memberActivityClass(dataItem: any) {
    return (dataItem.data.session == "sleep" || !dataItem.data.session) ? 'k-icon k-i-user black' : (dataItem.data.session == "recent") ? 'k-icon k-i-user red' : 'k-icon k-i-user blue'
  }

  selectLine() {
    this.currentType = 'Line'
    this.conversation = this.conversationLine
    if (this.selectedReceiver) {
      const tmp = this.chatMessageService.getRecordDetailsByLineIdUnRead(this.selectedReceiver.lineId).subscribe(records => {
        for (let record of records) {
          record.read = true
          this.chatMessageService.updateRecordDetailById(this.selectedReceiver.lineId, record)
        }
        tmp.unsubscribe()
      })
    }
  }

  selectWeChat() {
    this.currentType = 'WeChat'
    this.conversation = this.conversationWechat
    if (this.selectedReceiver) {
      const tmp = this.chatMessageService.getRecordDetailsByWechatIdUnRead(this.selectedReceiver.wechatId).subscribe(records => {
        for (let record of records) {
          record.read = true
          this.chatMessageService.updateRecordDetailById(this.selectedReceiver.wechatId, record)
        }
        tmp.unsubscribe()
      })
    }
  }

  uploadTempFile(event: any) {
    const fileName = new Uploader(event.target.files.item(0)).file.name
    this.updating = true
    this.uploadFileApiService.importFile(fileName, "temp", event).then(data => {
      this.updating = false
      let fileUrl = data.url
      console.log("this.urlsTotal", this.urlsTotal)
      console.log("fileUrl", fileUrl)
      // if (this.urlsTotal.map(file => file.url).indexOf(fileUrl) == -1) {
      //     this.urlsTotal.push({ name: fileName, url: fileUrl })
      // }
      if (this.persistentUrls.map(file => file.url).indexOf(fileUrl) == -1) {
        this.persistentUrls.push({ name: fileName, url: fileUrl })
      }
      this.myInputVariable.nativeElement.value = "";
    }).catch(err => {
      this.dialogDynamicTitle = "檔案上傳"
      this.dialogDynamicMessage = "檔案上傳失敗！請檢查檔案是否小於15MB或檔案為系統所支援的類型。"
      this.updating = false
      this.dialogOpenedUpload = true
      console.log("upload temp File failed---", err)
      this.myInputVariable.nativeElement.value = "";
    })
  }

  removeReceiver(receive: any) {
    if (this.receivers.map(receive => receive.id).indexOf(receive.id) !== -1) {
      this.receivers.splice(this.receivers.map(receiver => receiver.id).indexOf(receive.id), 1)
    }
  }

  removeUrls(data: any) {
    if (this.urlsTotal.map(files => files.url).indexOf(data.url) != -1) {
      this.urlsTotal.splice(this.urlsTotal.map(file => file.url).indexOf(data.url), 1)
    }
    console.log(this.urlsTotal)
  }

  async pushMessage() {
    this.updating = true
    this.receiversMember = []
    console.log("this.receivers", this.receivers)
    if (this.chooseType != 'list') {
      this.receiversMember = this.receivers.map((receiver, index) => {
        return {
          id: receiver.data.id,
          data: [{ message: this.viewMessage, urls: this.urlsTotal ? this.urlsTotal : [], name: receiver.data.name ? receiver.data.name : "" }]
        }
      })
    } else {
      this.receiversMember = this.receivers.map((receiver, index) => {
        return { ...receiver.data, id: receiver.data.id }
      })
    }

    console.log("this.receiversMember", this.receiversMember)
    let reviewMessage: ReviewMessage & { receivers: Receiver[] } = {
      id: uuid.v4(),
      state: 0,
      channel: this.channel as ReviewMessage["channel"],
      content: this.viewMessage,
      sender: this.member,
      receivers: this.receiversMember,
      expectTime: this.pushType == "delay" ? this.dataValue.getTime() : 9999999999999,
      urls: this.urlsTotal,
      type: this.pushType as ReviewMessage["type"],
      auditor: null,
      receiverCount: 0
    }
    console.log("reviewMessage", reviewMessage)
    this.reviewMessageApiService.createReviewMessage(reviewMessage).then(success => {
      this.updating = false
      console.log("success", success)
      this.init()
    }).catch(err => {
      this.updating = false
      console.log("err", err)
      this.init()
    })
  }

  init() {
    this.updating = false
    this.closeDialogue()
    this.formatMessage = ""
    this.viewMessage = ""
    this.sendFiles = []
    this.receivers = []
    this.urlsTotal = []
    this.listData = null
    this.pushType = "immediate"
    this.flexButtonsType = ""
  }
}

