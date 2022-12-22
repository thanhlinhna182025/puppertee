const puppeteer = require('puppeteer')

const startBrower = async () => {
    let brower
    try {
        brower = await puppeteer.launch({
            headless: true,
            args: ['--disable-extensions-except'],
            ignoreHTTPSErrors: true,
        })
    } catch (error) {
        console.log('Khong tao duoc brower :' + error)
    }
    return brower
}
module.exports = startBrower
