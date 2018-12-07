import path from 'path'

/**
 * Clear console 
 */
export const consoleClear = () => {
    console.log('\x1Bc');
}

/**
 * Get path of view file
 * @param {*} file 
 */
export const view = (file) => {
    return path.join(__basedir, 'views', file)
}

export const getNiceUrl = url => {
    let pattern = /https?:\/\/(?:www\.)?([a-zA-Z_]+\.[a-z]{1,4})/
    let match = url.match(pattern)
    let niceUrl = typeof match[1] !== 'undefined' ? match[1] : url

    return niceUrl
}