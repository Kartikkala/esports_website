import { IJwtPayload } from "./types.ts"
import express from 'express';

declare global {
    namespace Express {
    interface Request {
      user?: IJwtPayload
    }
  }
}


