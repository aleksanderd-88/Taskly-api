import { Response } from "express";
import models from '../../../models'
import { requestIsValid } from '../../libs'
import { sendMail } from '../../libs/mail'
import { get, pick } from "lodash";
import { validate } from "email-validator";
import dotenv from 'dotenv'
import { generateAuthToken } from "../../libs";
import { RequestCustom } from "../../../types";

dotenv.config()

export default async (req: RequestCustom, res: Response) => {
  try {
    const data = get(req, 'body.data', null)
    const id = get(req, 'params.id', null)
    const currentUser = get(req, 'user', null)
    let promises = []

    // Sanity check
    if ( !id || !requestIsValid(pick(data, ['name'])) )
      throw new Error('One or more parameters are missing')
    
    const { name, members = [] } = data
    const project = await models.Project.findById(id)
    if ( !project )
      throw new Error('Project not found')

    promises.push(models.Project.updateOne({ _id: id }, data))

    for (const newMember of members) {
      if ( newMember && !validate(newMember.email) )
        throw new Error('Email address is not valid')

      const memberExist = project.members.find(existingMember => existingMember.email === newMember.email)
      if ( memberExist )
        throw new Error('Member already exist')

      if ( currentUser?.email === newMember.email )
        throw new Error('You cannot add yourself as a member')

      await sendMail({
        recipient: newMember.email,
        subject: 'Invitation',
        html: `
          <p>You have been invited to join a project</p>
          <p>Project to join: <b>@Taskly/${ name }<b></p>
          <a href="${ process.env.PROJECT_JOIN_REDIRECT_URL }/projects/${ project._id }/join/${ generateAuthToken({ email: newMember.email }, '24h') }" target="_blank">
            Accept invitation
          </a>
        `
      })

      project.members.push({ email: newMember.email })
    }

    promises.push(project.save())
    
    await Promise.all(promises)

    res.status(200).end()
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not update project'))
  }
}