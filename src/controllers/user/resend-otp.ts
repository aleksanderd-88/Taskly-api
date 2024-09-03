import { Response } from "express";
import { RequestCustom } from "../../../types";
import get from "lodash/get";
import { requestIsValid, generateOtp } from "../../libs";
import { sendMail } from '../../libs/mail'
import models from "../../../models";

export default async (req: RequestCustom, res: Response) => {
  try {
    const data = get(req, 'body.data', null)

    // Sanity check
    if ( !requestIsValid(data) )
      throw new Error('One or more parameters are missing')

    const { email } = data
    const user = await models.User.findOne({ email })
    if ( !user )
      throw new Error('Unable to find user')

    if ( get(user, 'accountIsVerified', false) )
      throw new Error('Account has already been verified')

    const otp = generateOtp()
    await models.User.findOneAndUpdate({ email }, { otp }) //- Update with new "One Time Password" for next verification
  
    const response = await sendMail({ 
      recipient: email, 
      subject: 'Account verification', 
      html: `Use the 4-digit code below to verify your account <br/> <h1>${ otp }</h1>`
    })

    res.status(200).send(response)
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Something went wrong'))
  }
}