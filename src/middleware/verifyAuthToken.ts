import { NextFunction, Response } from "express";
import { RequestCustom, UserType } from "../../types";
import get from "lodash/get";
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export default (req: RequestCustom, res: Response, next: NextFunction) => {
  const bearer = get(req, 'headers.authorization', '')
  if ( typeof bearer === 'undefined' )
    return res.status(401).send('Unauthorized')

  const token = bearer.replace('Bearer ', '')
  if ( !token )
    return res.status(401).send('Token is missing')

  JWT.verify(token, process.env.SECRET_KEY || '', (err, data) => {
    if ( err )
      return res.status(403).send('Forbidden')
    
    req.user = data as UserType
    next()
  })
}