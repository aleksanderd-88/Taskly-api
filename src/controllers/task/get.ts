import { Response } from "express";
import { RequestCustom } from "../../../types";
import { get } from "lodash";
import models from "../../../models";

export default async (req: RequestCustom, res: Response) => {
  try {
    const id = get(req, 'params.id', null)
    if ( !id )
      throw new Error('Id is missing and is required')

    const task = await models.Task.findById(id).lean()
    res.status(200).send(task)
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Unable to accuire task'))
  }
}