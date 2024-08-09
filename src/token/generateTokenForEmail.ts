import * as crypto from 'crypto'

export const generateToken = (length: number): string => {
  return crypto.randomBytes(length).toString('hex')
}