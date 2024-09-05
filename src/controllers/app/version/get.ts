import { Request, Response } from "express"
import axios from 'axios'

export default async (req: Request, res: Response) => {
  try {
    const results = await Promise.all([
      axios.get('https://api.github.com/repos/aleksanderd-88/Taskly/commits?per_page=1'),
      axios.get('https://api.github.com/repos/aleksanderd-88/Taskly-api/commits?per_page=1')
    ])

    let response: { client: string, api: string } = { client: '', api: '' }
    let commits: { sha: string }[] = []

    results.forEach(result => commits.push(result.data[0]))

    response = {
      ...response,
      client: commits[0].sha,
      api: commits[1].sha
    }

    return res.status(200).send(response)
  } catch (error) {
    res.status(500).send('Failed to fetch application version')
  }
}