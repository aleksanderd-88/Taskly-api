import { get } from "lodash";
import { RequestCustom } from "../../types";
import models from "../../models";

export const userIsProjectOwner = async (id: string, req: RequestCustom) => {
  const currentUser = get(req, 'user', null)
  return models.Project.findOne({ _id: id, owner: get(currentUser, 'email', '') })
}