import webshot from 'webshot'
import path from 'path'
import fs from 'fs'
import shortid from 'shortid'
import config from '../config';
import puppeteer from 'puppeteer'

const publicPath = path.join('../public')
const directoryPath = path.join(__dirname,  publicPath, config.downloads)
let isSnapping = false

export const isBusy = () => {
    return isSnapping
}

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

    console.log('Creating webshot:', url)

    if(isBusy()) return

    let filename = shortid.generate() + '.png'
    let filepath = path.join(directoryPath, filename)
    let urlResult = config.api_url + config.downloads + filename
    var options = {
        path: filepath,
        type: 'png',
        fullPage: true
    }

    try {

        isSnapping = true
        const browser = await puppeteer.launch();
        const page = await browser.newPage()
        await page.setViewport({width: 1920, height:1080})
        await page.goto(url)
        await page.screenshot(options)
        isSnapping = false

        return {
            url: urlResult, 
            filename: filename, 
            url: config.api_url + config.downloads + filename
        }
    }
    catch (err) {
        console.log('Error on puppeteer:', err)
        isSnapping = false
    }


    expor
}

export const createWebshot_old = async(url) => {
    return new Promise((resolve, reject) => {
        try {
            let filename = shortid.generate() + '.png'
            let filepath = path.join(directoryPath, filename)
            let options = {
                phantomPath: 'phantomjs',
                streamType: 'png',
                siteType: 'url',
                windowSize: config.windowSize,
                shotSize: {width: config.windowSize.width, height: 'all'},

                userAgent: config.user_agent,
                cookies: config.cookies,
                phantomConfig: {"ssl-protocol":"ANY", 'ignore-ssl-errors': 'true'}, //, "cookies-file": path.join(__basedir, 'cookies.txt')
                customHeaders: config.customHeaders,
                renderDelay: 5000,
                takeShotOnCallback: false
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