import { Request, Response } from 'express'
import models from '../../../models'
import get from 'lodash/get'
import bcrypt from 'bcryptjs'
import { requestIsValid, generateOtp } from '../../libs'
import { sendMail } from '../../libs/mail'

const findAndDelete = async (email: string) => {
  await models.User.findOneAndDelete({ email })
}

export default async (req: Request, res: Response) => {
  try {
    const data = get(req, 'body.data', null)
  
    // Sanity check
    if ( !requestIsValid(data) )
      throw new Error('One or more parameters are missing')
    
    const { email, password, verifiedPassword } = data

    if ( password !== verifiedPassword )
      throw new Error('Please verify password')

    data.password = await bcrypt.hash(password, 10)
    delete data.verifiedPassword // Don't need this

    const otp = generateOtp()

    data.otp = otp
    await models.User.create(data)

    const response = await sendMail({ 
      recipient: email, 
      subject: 'Account verification', 
      html: `Use the 4-digit code below to verify your account <br/> <h1>${ otp }</h1>`
    })

    res.status(200).send(response)
  } catch (error) {
    return findAndDelete(get(req, 'body.data.email', null))
    .then(() => res.status(500).send(get(error, 'message', 'Could not create user')))
  }
}