import { Response } from "express";
import { RequestCustom } from "../../../types";
import get from 'lodash/get'
import { requestIsValid, verifyJwtToken } from "../../libs";
import models from "../../../models";

export default async (req: RequestCustom, res: Response) => {
  try {
    // Send project._id to get project details
    const data = get(req, 'body.data', null)
    if ( !requestIsValid(data) )
      throw new Error('One or more parameters are missing and are required for verification')

    const { token, projectId } = data
    verifyJwtToken(token)

    const project = await models.Project.findOne({ _id: projectId }).lean()
    res.status(200).send(project)
  } catch (error) {
    res.status(401).send(get(error, 'message', 'No access'))
  }
}