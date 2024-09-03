import { Response } from "express";
import { RequestCustom } from "../../../types";
import models from "../../../models";
import get from 'lodash/get'
import { FlattenMaps } from "mongoose";

export default async (req: RequestCustom, res: Response) => {
  try {
    const filter = get(req, 'body.data.filter', { isDeleted: false })
    const userId = get(req, 'user._id', null)
    let data = { userId }
    
    if ( filter && Object.keys(filter).length )
      data = { ...data, ...filter }

    let projects = await models.Project.find(data).lean()
    let results: FlattenMaps<Record<string, unknown>[]> = []
    
    for (const project of projects) {
      project.tasks = await models.Task.find({ projectId: get(project, '_id', null) })
      
      const visibleMembers = project.members.filter(member => member.verified)
      results = [ ...results, { ...project, ...{ members: visibleMembers } } ]
    }

    res.status(200).send({ rows: results, count: results.length })
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not create project'))
  }
}