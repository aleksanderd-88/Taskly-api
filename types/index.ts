import { Request } from 'express';

export interface RequestCustom extends Request {
  user?: UserType
}

export type UserType = {
  username: string
  email: string
  authToken?: string
  _id?: string
}

export type MailType = {
  recipient: string
  subject?: string
  text?: string
  html?: string
}