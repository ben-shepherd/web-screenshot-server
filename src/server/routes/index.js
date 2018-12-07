import express from 'express'
import { view } from '../libs/helper/helpers'
import { createWebshot, getCookies, isBusy } from '../libs/webshot'
import { saveFile, exists, getFiles, deleteFile } from '../libs/files';

const router = express.Router()

router.get('/', async(req, res) => {
	res.sendFile(view('index.html'))
})

/**
 * Index, list of available functions
 */
router.post('/snap', async(req, res) => {
	try {

		var { url } = req.body.params

		// Check if API is currently screenshotting
		// Prevents high CPU usage
		if(isBusy()) {
			return res.json({error: 'Webshot is busy, try again later'})
		}

		// Check url GET parameter exists
		if(typeof url === 'undefined') {
			return res.json({error: 'Parameter query is required'})
		}

		// Create screenshot
		let request = await createWebshot(url)

		// Save file Params: (Source URL, Saved image URL)
		let saveResult = await saveFile(url, request.url)

		if(typeof req.query.asHTML === 'undefined') {
			res.status(200).json({status: 200, file_id: saveResult.insertId, request})
		}
		else {
			res.status(200).send('<img src="'+request.url+'">')
		}
	}
	catch(e) {
		console.log('Error on /snap: ', e)
		res.status(e.status || 500).json(e)
	}
})

/**
 * Save file
 */
router.post('/save', async(req, res) => {
	try {
		const { url, image_url, category } = req.body

		if(await exists(url, category) == false)  {
			let result = await saveFile(url, image_url, category)
			res.status(200).json({status: 'ok', result})
		}
		else {
			console.log('Skipping', {category, url})
			res.status(200).json({status: 'already exists'})
		}
	}
	catch (err) {
		console.log('Error on /save', {error: err, response: err.response})
		res.status(500 || err.status).json({err})
	}
})

/**
 * Get array of files
 */
router.post('/get', async(req, res) => {
	try {
		var acceptedCategories = ['Ads', 'Non-Ads', 'None']
		var category = req.body.category

		if(typeof category == 'undefined' || !acceptedCategories.includes(category)) {
			res.status(200).json({error: 'A category must be provided: ' + acceptedCategories.join(', ')})
		}
		let files = await getFiles(category)

		res.status(200).json({files})
	}
	catch (err) {
		console.log('Error on /get', err)
	}
})

router.post('/delete', async(req, res) => {
	try {
		let result = await deleteFile(req.body.id)

		res.send(200).json({result})
	}
	catch (err) {
		console.log('Error on /delete')
		res.send(e.status || 500).json({err})
	}
})
/**
 * Ping 
 */
router.get('/ping', async(req, res) => {
	res.status(200).send('pong')
})

export default router
