import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.ATLAS_DB_URL || '')
.then(() => console.log('Successfully established database connection'))
.catch(() => console.log('Failed to establish database connection'))

export default mongoose