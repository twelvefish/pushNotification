export type User = {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "staff"
}

export type Catalog = {
  id: string
  name: string
  index: number
  messageId: string[]
  type: "dynamic" | "static"
  userId: string
}

export type Message = {
  id: string
  title: string
  content: string
  thumb: string
}

export type Member = {
  id: string
  name: string
  title: string
  division: string
  department: string
  lineId: string
  wechatId: string
  email: string
  mobilePhone: string
  data?: any
}

export type KendoNode = {
  id: string
  text: string
  parentId?: string
  type: string
  data?: any
}

export type File = {
  id: string
  mimeType: string
  name: string
  fullName: string
  parents: string
  parentsName: parentsName[]
  sid: number
  docId: string
  modifyDate: number
}

export type parentsName = {
  id: string
  name: string
  fullName: string
}

export type ChatMessage = {
  id: string
}

export type RecordDetail = {
  id: string
  channel: "Line" | "WeChat" | "SMS" | "Email"
  // content: string 將來改名
  message: string
  // receiver: string 將來改型態
  receiver: Receiver
  receiveTime: number
  read: boolean
  urls: Urls[]
}

export type Group = {
  id: string
  memberId: string[]
  name: string
  ownerId: string
}

export type List = {
  id: string
  members: Content[]
  name: string
  ownerId: string
}

export type Content = {
  content: string
  id: string
  name: string
}

export type ReviewMessage = {
  id: string
  content: string
  sender: User
  type: 'immediate' | 'delay'
  expectTime: number
  receiverCount: number
  channel: "Line" | "WeChat" | "SMS" | "Email"
  urls: Urls[]
  auditor: User
  /**
  * 0: 未處理
  * 1: 通過 / 未發送
  * 2: 通過 / 已發送
  * 3: 未通過
  */
  state: 0 | 1 | 2 | 3
}

export type Urls = {
  name: string
  url: string
}

export type Receiver = {
  id: string
  index?: number
  data: any[]
}

export class Uploader {
  file: File;
  name: string;
  url: string;
  progress: number;
  createdAt: Date = new Date();
  constructor(file: File) {
    this.file = file;
  }
}
