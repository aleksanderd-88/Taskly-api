import { Request, Response } from 'express'
import models from '../../../models'
import get from 'lodash/get'
import pick from 'lodash/pick'
import bcrypt from 'bcryptjs'
import { requestIsValid, generateAuthToken } from '../../libs'

export default async (req: Request, res: Response) => {
  try {
    const data = get(req, 'body.data', null)
  
    // Sanity check
    if ( !requestIsValid(data) )
      throw new Error('One or more parameters are missing')
    
    const { email, password, otp } = data

    let query = otp ? { otp } : { email }

    const user = await models.User.findOne(query).lean()
    if ( !user )
      throw new Error('Failed to find user')

    const userIsVerifyingAccount = otp //- One time password
    if ( userIsVerifyingAccount ) {
      await models.User.findOneAndUpdate({ _id: get(user, '_id', '')}, { accountIsVerified: true, otp: null })
      return res.status(200).end()
    }

    if ( !get(user, 'accountIsVerified', false) )
      throw new Error('Account is not yet verified')

    const passwordIsVerified = await bcrypt.compare(password, get(user, 'password', ''))
    if ( !passwordIsVerified )
      throw new Error('Failed to verify password')

    const authToken = generateAuthToken({ ...pick(user, ['username', 'email', '_id']) })
    if ( !authToken )
      throw new Error('Failed to generate authentication token')

    res.status(200).send({ ...user, authToken })
  } catch (error) {
    return res.status(500).send(get(error, 'message', 'Authentication failed'))
  }
}