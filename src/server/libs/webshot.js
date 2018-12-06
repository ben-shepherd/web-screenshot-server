import webshot from 'webshot'
import path from 'path'
import fs from 'fs'
import shortid from 'shortid'
import config from '../config';
const url = require('url')

const publicPath = path.join('../public')
const directoryPath = path.join(__dirname,  publicPath, config.downloads)

export const getCookies = () => {

    let cookies = config.cookies
    let cookiesArray = cookies.split(';').reduce((prev, current) => {
        const [name, value] = current.split('=');
        prev[name] = value;
        return prev
      }, {});

    return cookiesArray
}

export const createWebshot = async(url) => {
    return new Promise((resolve, reject) => {
        try {
            let filename = shortid.generate() + '.png'
            let filepath = path.join(directoryPath, filename)
            let options = {
                windowSize: config.windowSize,
                shotSize: {width: config.windowSize.width, height: 'all'},
                //userAgent: config.user_agent,
                cookies: getCookies(),
                renderDelay: 1000,
            }

            console.log({options})
    
            if(!fs.existsSync(publicPath)) {
                fs.mkdirSync(publicPath)
            }
            if(!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath)
            }

            webshot(url, filepath, options, err => {
                if(err) {
                    reject(err)
                }
                else {
                    resolve({
                        url, 
                        filename, 
                        url: config.api_url + config.downloads + filename
                    })
                }
            })
        }
        catch (err) {
            reject(err)
        }
    })
}