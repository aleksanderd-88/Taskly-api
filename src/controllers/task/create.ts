import { Response } from "express";
import { RequestCustom } from "../../../types";
import { requestIsValid } from "../../libs";
import { get, pick } from "lodash";
import models from "../../../models";

export default async (req: RequestCustom, res: Response) => {
  try {
    const data = get(req, 'body.data', null)

    // Sanity check
    if ( !requestIsValid(pick(data, ['title'])) )
      throw new Error('One or more parameters are missing')

    await models.Task.create(data)
    res.status(201).end()
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not create task'))
  }
}