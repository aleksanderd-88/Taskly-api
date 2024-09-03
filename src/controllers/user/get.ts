import { Response } from "express";
import { RequestCustom } from "../../../types";
import get from "lodash/get";
import { requestIsValid } from "../../libs";
import models from "../../../models";

export default async (req: RequestCustom, res: Response) => {
  try {
    const data = get(req, 'body.data', null)

    // Sanity check
    if ( !requestIsValid(data) )
      throw new Error('One or more parameters are missing')

    const { authToken } = data
    const user = await models.User.findOne({ email: get(req, 'user.email', '') }).lean()
    if ( !user )
      throw new Error('Unable to find user')
  
    res.status(200).send({ ...user, authToken })
  } catch (error) {
    res.status(403).send(get(error, 'message', 'No access'))
  }
}