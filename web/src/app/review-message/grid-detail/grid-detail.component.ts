import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { SortDescriptor, orderBy } from "@progress/kendo-data-query"

import { ReviewMessage, Receiver } from "../../model"
import { ReviewMessageService } from "../../services/reviewMessage/review-message.service"
import { MemberService } from "../../services/member/member.service"
import { GridDataResult, DataStateChangeEvent } from "@progress/kendo-angular-grid";

@Component({
  selector: 'app-grid-detail',
  encapsulation: ViewEncapsulation.None, //這是啥??
  templateUrl: './grid-detail.component.html',
  styleUrls: ['./grid-detail.component.scss']
})
export class GridDetailComponent implements OnInit {

  @Input() reviewMessage: ReviewMessage
  @Input() btnVisible: boolean = false

  @Output() clickAgree: EventEmitter<ReviewMessage> = new EventEmitter()
  @Output() clickReject: EventEmitter<ReviewMessage> = new EventEmitter()

  sort: Array<SortDescriptor> = []
  pageSize = 10
  skip = 0

  receiversGrid: GridDataResult
  receivers: Receiver[]

  loading: boolean = false

  constructor(
    private reviewMessageService: ReviewMessageService,
    private memberService: MemberService) {

  }

  ngOnInit() {
    console.log(this.reviewMessage)
    this.getReviewMessageReceivers()
  }

  onClickAgree(e: ReviewMessage) {
    this.clickAgree.emit(e)
  }

  onClickReject(e: ReviewMessage) {
    this.clickReject.emit(e)
  }

  getReviewMessageReceivers() {
    // this.reviewMessageService.getReviewMessageReceivers(this.reviewMessage.id).subscribe(async receivers => {
    //     this.receivers = receivers
    //     this.filterMessageRecord()
    // })
    this.reviewMessageService.getReviewMessageReceiversStartAndEnd(this.reviewMessage.id, this.skip).subscribe(receivers => {
      this.receivers = receivers
      this.filterMessageRecord()
    })

  }

  onRecordDetailStateChange({ skip, take, sort }: DataStateChangeEvent) {
    this.skip = skip
    this.pageSize = take
    this.sort = sort

    // this.filterMessageRecord()
    this.getReviewMessageReceivers()
  }


  filterMessageRecord() {
    this.receiversGrid = {
      data: orderBy(this.receivers, this.sort),//.slice(this.skip, this.skip + this.pageSize),
      total: this.reviewMessage.receiverCount //this.receivers.length
    }
    this.getReceiversMember()
  }

  async getReceiversMember() {
    this.loading = true
    const arr = []
    for (let receiver of this.receiversGrid.data) {
      arr.push(this.memberService.getMemberByIdPromise(receiver.id).then(member => {
        receiver.name = member.name.replace(/\n/g, "")

        receiver["content"] = this.formatRecordText(this.reviewMessage.content, receiver.data).replace(/\n/g, "<br/ >")
        receiver["urls"] = this.reviewMessage.urls
      }))
    }

    await Promise.all(arr)
    this.loading = false
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

}
