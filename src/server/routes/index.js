import express from 'express'
import { view } from '../libs/helper/helpers'
import { createWebshot } from '../libs/webshot'


const router = express.Router()
/**
 * Index, list of available functions
 */
router.get('/snap', async(req, res) => {
	try {

		console.log({'params': req.query})
		
		if(typeof req.query.url === 'undefined') {
			return res.json({error: 'Parameter query is required'})
		}

		let request = await createWebshot(req.query.url)

		res.status(200).json({status: 200, request})
	}
	catch(e) {
		console.log('Error on /snap: ', e)
		res.status(e.status || 500).json(e)
	}
})

router.get('/ping', async(req, res) => {
	res.status(200).send('pong')
})

export default router
