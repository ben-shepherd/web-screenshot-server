import { dbQuery } from './db'
import { getNiceUrl } from './helper/helpers';

export const exists = async(url, category) => {
    return new Promise(async(resolve, reject) => {
        try {
            let request = await dbQuery('SELECT * FROM ws_files WHERE url = ? AND category = ?', [url, category])
            resolve(request.length > 0)
        }
        catch (err) {
            reject(err)
        }
    })
}

export const saveFile = async(url, image_url, category = 'None') => {
    let nice_url = getNiceUrl(url)
    return await dbQuery('INSERT INTO ws_files (url, nice_url, image_url, category) VALUES (?, ?, ?, ?)', [url, nice_url, image_url, category])    
}

export const getFiles = async(category = 'None') => {
    try {
        return await dbQuery('SELECT * FROM ws_files WHERE category = ? ORDER BY id DESC', [category])
    }
    catch (err) {
        console.log('Error on getFiles', err)
    }
}

export const deleteFile = async(id) => {
    try {
        return await dbQuery('DELETE FROM ws_files WHERE id = ?', [id])
    }
    catch (err) {
        console.log('Error on deleteFile', err)
    }
}