import { Response } from "express";
import { RequestCustom } from "../../../types";
import { get } from "lodash";
import models from "../../../models";

export default async (req: RequestCustom, res: Response) => {
  try {
    const id = get(req, 'params.id', null)
  
    // Sanity check
    if ( !id )
      throw new Error('Id is missing and is required')

    await models.Task.findOneAndDelete({ _id: id })
    res.status(200).send({ deletedRows: 1 })
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not delete task'))
  }
}