import { Response } from "express";
import { RequestCustom } from "../../../types";
import models from "../../../models";
import get from 'lodash/get'
import { FlattenMaps } from "mongoose";
import { omit } from "lodash";

export default async (req: RequestCustom, res: Response) => {
  try {
    let filter: FlattenMaps<Record<string, unknown>> = {}
    const userId = get(req, 'user._id', '')

    Object.entries(get(req, 'body.data.filter', {})).forEach(([key, value]) => {
      if( key === 'isDeleted' && value ) {
        filter = { isDeleted: value, userId }
      }
      if ( key === 'member' && value ) {
        filter = { members: { $elemMatch: { email: value, verified: true } } }
      }
    })

    let data: Record<string, unknown> = { userId, isDeleted: false }
    
    if ( filter && Object.keys(filter).length )
      data = { ...omit(data, ['userId']), ...filter }

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