import express from 'express'
import bodyParser from 'body-parser' 
import cookieParser from 'cookie-parser'
import cors from 'cors'
import fileUpload from'express-fileupload'
import routes  from './routes'
import config from './config'

global.__basedir = __dirname
const app = express()
const port = config.port

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(fileUpload())
app.use(bodyParser.urlencoded({
		extended: true
	})
)

app.use(cors())
app.use(cookieParser())
app.use('/', routes)

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

export default app