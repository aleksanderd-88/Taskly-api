import { Response } from "express";
import { RequestCustom } from "../../../types";
import models from "../../../models";
import get from 'lodash/get'
import { verifyJwtToken } from "../../libs";

export default async (req: RequestCustom, res: Response) => {
  try {
    const token = get(req, 'body.data.token', null)
    if ( !token )
      throw new Error('Token is missing and is required for verification')

    const data = verifyJwtToken(token)

    const project = await models.Project.findOne({ isDeleted: false, members: { $elemMatch: { email: data.email } } })
    if ( !project )
      throw new Error('Could not find associated member')
    
    const member = project.members.find(member => member.email === data.email)
    if ( member ) {
      if ( member.verified )
        throw new Error('Member has already been verified')

      member.verified = true
    }

    await project.save()
    res.status(200).end()
  } catch (error) {
    res.status(400).send(get(error, 'message', 'Verification failed'))
  }
}