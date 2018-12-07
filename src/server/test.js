/**
 * Write your tests here
 */
import { saveFile, exists, getFiles } from './libs/files'

(async() => {

    try {
        //let request = await saveFile('http://www.google.com', 'somewhere.jpg', 'Ads')

        let request = await getFiles('None')
        console.log({'test request': request})
    }
    catch (err) {
        console.log({err})
    }
})()