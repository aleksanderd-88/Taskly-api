import { Response } from "express";
import models from '../../../models'
import { get } from "lodash";
import { RequestCustom } from "../../../types";
import { userIsProjectOwner } from "../../utils/user-access";

export default async (req: RequestCustom, res: Response) => {
  try {
    const id = get(req, 'params.id', null)

    // Sanity check
    if ( !id )
      throw new Error('Id is missing and is required')

    if ( !userIsProjectOwner(id, req) )
      throw new Error('You dont have permission to perform this action')
    
    await models.Project.updateOne({ _id: id }, { isDeleted: true, deletedAt: new Date() })
    res.status(200).send({ deletedRows: 1 })
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not delete project'))
  }
}