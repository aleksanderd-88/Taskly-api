import formData from 'form-data';
import Mailgun from 'mailgun.js';
import dotenv from 'dotenv'
import { MailType } from '../../../types';
import validator from 'email-validator'

dotenv.config()

const mailgun = new Mailgun(formData)

const mg = mailgun.client({ 
  username: process.env.MAILGUN_USERNAME || '', 
  key: process.env.MAILGUN_SENDING_API_KEY || '', 
  url:process.env.MAILGUN_URL || '' 
});

export const sendMail = async (params: MailType) => {
  const { recipient, subject, text, html } = params

  return mg.messages.create(process.env.MAILGUN_DOMAIN || '', {
  	from: process.env.MAILGUN_FROM_ADDRESS || '',
  	to: [recipient],
  	subject: subject || "Greetings from Taskly!",
  	text: text || "This is a test mail!",
  	html: html || "<h1>It Works!</h1>"
  })
  .then(msg => Promise.resolve(msg))
  .catch(err => Promise.reject(err))
}

export const validate = (email: string) => validator.validate(email)