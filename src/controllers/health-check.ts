import { Request, Response } from "express"
export default (req: Request, res: Response) => {
  try {
    res.status(200).send('API initialized')
  } catch (error) {
    res.status(500).send('API failed to initialize')
  }
}