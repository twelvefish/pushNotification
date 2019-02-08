import { Component, OnInit } from '@angular/core';
import { FilterService, GridDataResult, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy, State, process } from "@progress/kendo-data-query"

import { ReviewMessageService } from '../services/reviewMessage/review-message.service'
import { ReviewMessageApiService } from '../apiServices/reviewMessageApi/review-message-api.service';
import { MemberService } from '../services/member/member.service';

import { ReviewMessage, User } from '../model';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-review-message',
  templateUrl: './review-message.component.html',
  styleUrls: ['./review-message.component.scss']
})
export class ReviewMessageComponent implements OnInit {

  user: User
  updateSuccess: boolean = false
  approvalState: string[] = ["通過", "不通過"]
  state: State = {
    filter: {
      logic: 'and',
      filters: [
        // { field: 'sender', operator: 'contains', value: '' }
      ]
    }
  };

  processedGridArray = []
  processedGrid: GridDataResult = process(this.processedGridArray, this.state);
  sortList: Array<SortDescriptor> = []

  unprocessedGrid: GridDataResult
  unprocessedGridArray = []

  overdueGrid: GridDataResult
  overdueGridArray = []

  dialogOpenedReject: boolean = false;
  dialogOpenedResolve: boolean = false;
  selectedReviewMessage: ReviewMessage = null

  constructor(
    private reviewMessageApiService: ReviewMessageApiService,
    private reviewMessageService: ReviewMessageService,
    private memberService: MemberService,
    private auth: AngularFireAuth,
    private userService: UserService
  ) {
    this.auth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.userService.getUserById(firebaseUser.uid).subscribe(users => {
          this.user = users[0]
          console.log("user", users[0])

          if (this.user.role == 'staff') {
            // 已處理
            this.reviewMessageService.getReviewMessageByStateAndUserId(1, this.user.id).subscribe(successes => {
              this.processedGridArray = orderBy(successes, [{ field: "expectTime", dir: "desc" }])
              for (let processedGrid of this.processedGridArray) {
                for (let receiver of processedGrid.receivers) {
                  this.memberService.getMemberByIdPromise(receiver.id).then(member => {
                    receiver["name"] = member.name
                  })
                  receiver["content"] = this.formatRecordText(processedGrid.content, receiver.data)
                  receiver["urls"] = processedGrid.urls
                }
              }
              console.log("this.processedGridArray", this.processedGridArray)
              this.filterMessage()
            })

            // 待處理
            this.reviewMessageService.getReviewMessageUnProcessedAndUserId(new Date().getTime(), this.user.id).take(1).subscribe(unprocesses => {
              this.unprocessedGridArray = unprocesses
              for (let unprocessedGrid of this.unprocessedGridArray) {
                for (let receiver of unprocessedGrid.receivers) {
                  this.memberService.getMemberByIdPromise(receiver.id).then(member => {
                    receiver["name"] = member.name
                  })
                  receiver["content"] = this.formatRecordText(unprocessedGrid.content, receiver.data)
                  receiver["urls"] = unprocessedGrid.urls
                }
              }
              console.log("this.unprocessedGridArray", this.unprocessedGridArray)
              this.filterMessage()
            })

            // 逾期
            this.reviewMessageService.getReviewMessageOverDueAndUserId(new Date().getTime(), "delay", this.user.id).subscribe(overdues => {
              this.overdueGridArray = overdues
              for (let overdueGrid of this.overdueGridArray) {
                for (let receiver of overdueGrid.receivers) {
                  this.memberService.getMemberByIdPromise(receiver.id).then(member => {
                    receiver["name"] = member.name
                  })
                  receiver["content"] = this.formatRecordText(overdueGrid.content, receiver.data)
                  receiver["urls"] = overdueGrid.urls
                }
              }
              console.log("this.overdueGridArray", this.overdueGridArray)
              this.filterMessage()
            })
          } else {
            // 1 已 + 未發
            // 2 已 + 已發
            // 未通過
            this.reviewMessageService.getReviewMessageByState(1).subscribe(successes => {
              console.log("successes", successes)
              this.processedGridArray = orderBy(successes, [{ field: "type", dir: "asc" }, { field: "expectTime", dir: "desc" }])
              console.log("this.processedGridArray", this.processedGridArray)
              this.filterMessage()
            })

            // 待處理
            this.reviewMessageService.getReviewMessageUnProcessed(new Date().getTime()).subscribe(unprocesses => {
              this.unprocessedGridArray = unprocesses
              console.log("this.unprocessedGridArray", this.unprocessedGridArray)
              this.filterMessage()
            })

            // 逾期
            this.reviewMessageService.getReviewMessageOverDue(new Date().getTime(), "delay").subscribe(overdues => {
              this.overdueGridArray = overdues
              console.log("this.overdueGridArray", this.overdueGridArray)
              this.filterMessage()
            })
          }
        })
      }
    })
  }

  ngOnInit() {
  }

  categoryChange(values: any[], filterService: FilterService): void {
    filterService.filter({
      filters: values.map(value => ({
        field: 'state',
        operator: 'eq',
        value
      })),
      logic: 'or'
    });
  }

  filterMessage() {
    this.processedGrid = {
      data: orderBy(this.processedGridArray, this.sortList),
      total: this.processedGridArray.length
    }

    this.unprocessedGrid = {
      data: orderBy(this.unprocessedGridArray, this.sortList),
      total: this.unprocessedGridArray.length
    }

    this.overdueGrid = {
      data: orderBy(this.overdueGridArray, this.sortList),
      total: this.overdueGridArray.length
    }
  }

  formatContentText(message: string, data: any): string {
    let content = this.formatContentArray(message, data)
    for (const key in data) {
      const regex = new RegExp("{{" + key + "}}", "g")
      const tmp = data[key]
      if (typeof tmp == "number")
        content = content.replace(regex, this.numberWithCommas(tmp))
      else if (!Array.isArray(tmp))
        content = content.replace(regex, tmp)
    }
    return content.replace(/\\n/g, "\n")
  }

  formatRecordText(message: string, datas: any[]): string {
    let content = ""
    if (datas.length > 0) {
      for (const data of datas)
        content += this.formatContentText(message, data)
    } else
      content = message
    return content
  }

  formatContentArray(message: string, data: any): string {
    let content = message
    const arrayPattern = /\[\[.+\]\]/gm
    const matchResults = content.match(arrayPattern) || []
    for (const result of matchResults) {
      let template = result.substring(2, result.length - 2)
      let replaceTemp = ""
      for (const dataKey in data) {
        if (Array.isArray(data[dataKey])) {
          const arr = data[dataKey]
          const regex = new RegExp("{{" + dataKey + "\.[a-zA-Z]+}}", "g")
          if (regex.test(template)) {
            for (const tmp of arr) {
              let tmpelateTmp = template
              for (const tmpKey in tmp) {
                const tmpRegex = new RegExp("{{" + dataKey + "." + tmpKey + "}}", "g")
                tmpelateTmp = tmpelateTmp.replace(tmpRegex, tmp[tmpKey])
              }
              replaceTemp += tmpelateTmp
            }
          }
        }
      }
      if (replaceTemp == "") {
        replaceTemp = "無"
      }
      content = content.replace(result, replaceTemp)
    }
    return content
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  resolve(dataItem: ReviewMessage) {
    console.log("dataItem", dataItem)
    this.updateSuccess = true
    this.reviewMessageApiService.agree(dataItem.id).then(() => {
      this.init()
      console.log("===核准成功===")
    }).catch(err => {
      this.init()
      console.log("===核准失敗===", err)
    })
  }

  reject(dataItem: ReviewMessage) {
    console.log("dataItem", dataItem)
    this.updateSuccess = true
    this.reviewMessageApiService.reject(dataItem.id).then(() => {
      this.init()
      console.log("===駁回成功===")
    }).catch(err => {
      this.init()
      console.log("===駁回失敗===", err)
    })
  }

  dataStateChange(state: DataStateChangeEvent): void {
    console.log("state", state)
    this.state = state;
    this.processedGrid = process(this.processedGridArray, this.state);
    console.log(this.processedGrid)
  }

  init() {
    this.updateSuccess = false
    this.selectedReviewMessage = null
    this.dialogOpenedReject = false
    this.dialogOpenedResolve = false
  }
  // filterChange(filter: CompositeFilterDescriptor): void {
  //    console.log("filter", filter)
  //    let data: any = filter.filters[0]
  //    data.
  // }

  // onSelectionChange(fieldName: string): any {

  // }
}
