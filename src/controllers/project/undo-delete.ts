import { Response } from "express";
import models from '../../../models'
import { get } from "lodash";
import { RequestCustom } from "../../../types";

export default async (req: RequestCustom, res: Response) => {
  try {
    const ids = get(req, 'body.data.ids', [])

    // Sanity check
    if ( !ids.length )
      throw new Error('Missing id(s)')

    const deletedProjects = await models.Project.find({ isDeleted: true })
    const activeProjects = await models.Project.find({ isDeleted: false })

    const multipleDuplicateEntries = (collection: { name: string }[]) => ids.length > 1 && deletedProjects.filter(deletedProject => collection.find(item => item.name === deletedProject.name)).length > 1

    let foundDuplicateEntry = activeProjects.some(activeProject => deletedProjects.find(deletedProject => activeProject.name === deletedProject.name))

    if ( foundDuplicateEntry )
      return res.status(400).send({error: 'Duplicate entry', code: 409})

    if ( foundDuplicateEntry = multipleDuplicateEntries(deletedProjects) )
      return res.status(400).send({error: 'Duplicate entry', code: 409})

    await models.Project.updateMany({ _id: ids }, { isDeleted: false, deletedAt: null })
    res.status(200).send({ updatedRows: ids.length })
  } catch (error) {
    res.status(500).send(get(error, 'message', 'Could not undo project(s)'))
  }
}