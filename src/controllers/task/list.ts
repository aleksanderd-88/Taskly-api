import { Response } from "express";
import { RequestCustom } from "../../../types";
import models from "../../../models";
import { get } from "lodash";

export default async (req: RequestCustom, res: Response) => {
  try {
    const projectId = get(req, 'body.data.projectId', null)
    if ( !projectId )
      throw new Error('Project id is missing and is required')

    const tasks = await models.Task.find({ projectId }).lean()
    return res.status(200).send({ rows: tasks, count: tasks.length })
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not create project'))
  }
}