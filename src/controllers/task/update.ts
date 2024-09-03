import { Response } from "express";
import { RequestCustom } from "../../../types";
import { requestIsValid } from "../../libs";
import { get, pick } from "lodash";
import models from "../../../models";

export default async (req: RequestCustom, res: Response) => {
  try {
    const id = get(req, 'params.id', null)
    const data = get(req, 'body.data', null)
  
    // Sanity check
    if ( !id || !requestIsValid(pick(data, ['title'])) )
      throw new Error('One or more parameters are missing')

    data.priority = get(data, 'priority.name', '')
    data.status = get(data, 'status.name', '')

    await models.Task.findOneAndUpdate({ _id: id }, data)
    res.status(200).send({ updatedRows: 1 })
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not create task'))
  }
}