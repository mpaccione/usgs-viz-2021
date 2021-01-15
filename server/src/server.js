import cors from 'cors'
import morgan from 'morgan'
import app from './routes.js'
import { dbConnTest } from "../helpers/db.js";

dbConnTest()

app.use(morgan('combined'))
app.use(cors())

app.get('/', (req, res) => res.send('Basic API'))
app.listen(8081, () => console.log('API listening on port 8081!'))