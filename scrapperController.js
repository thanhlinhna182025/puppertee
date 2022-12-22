const scrappers = require('./scrapper')
const fs = require('fs')

const crapperController = async (browerInstance) => {
    const url = 'https://phongtro123.com/'
    try {
        let browser = await browerInstance
        const categories = await scrappers.scrappeCategory(browser, url)
        // const data1 = await scrappers.scrapper(browser, categories[1].link)
        // fs.writeFile('chothuephongtro.json', JSON.stringify(data1), (err) => {
        //     if (err) {
        //         console.log('Có lỗi khi ghi file :' + err)
        //     }
        //     console.log('Thành công ghi file')
        // })
        const data2 = await scrappers.scrapper(browser, categories[2].link)
        fs.writeFile('nhachothue.json', JSON.stringify(data2), (err) => {
            if (err) {
                console.log('Có lỗi khi ghi file :' + err)
            }
            console.log('Thành công ghi file')
        })
        // const data3 = await scrappers.scrapper(browser, categories[3].link)
        // fs.writeFile('chothuecanho.json', JSON.stringify(data3), (err) => {
        //     if (err) {
        //         console.log('Có lỗi khi ghi file :' + err)
        //     }
        //     console.log('Thành công ghi file')
        // })

        await browser.close()
    } catch (error) {
        console.log('Co loi tai crapperController :' + error)
    }
}

module.exports = crapperController
