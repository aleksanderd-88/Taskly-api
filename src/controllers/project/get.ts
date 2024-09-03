import { Response } from "express";
import { RequestCustom } from "../../../types";
import models from "../../../models";
import get from 'lodash/get'
import { FlattenMaps } from "mongoose";

export default async (req: RequestCustom, res: Response) => {
  try {
    const id = get(req, 'params.id', null)
    if ( !id )
      throw new Error('Id is missing and is required')
    
    let project = await models.Project.findOne({ _id: id }).lean()
    let result: FlattenMaps<{}> = {}

    project!.tasks = await models.Task.find({ projectId: get(project, '_id', null) })

    result = { ...project, ...{ members: project?.members.filter(member => member.verified) } }
    
    res.status(200).send(result)
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not create project'))
  }
}