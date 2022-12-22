const DATA = {}

const scrappeCategory = (browser, url) =>
    new Promise(async (resolve, reject) => {
        try {
            const page = await browser.newPage()
            console.log('mo trinh duyet moi')
            await page.goto(url)
            console.log('Dang di toi :' + url)
            await page.waitForSelector('#webpage')
            console.log('Da load xong ')
            const categories = await page.$$eval(
                '#menu-main-menu > li',
                (els) => {
                    categories = els.map((el) => {
                        return {
                            category: el.querySelector('a').innerText,
                            link: el.querySelector('a').href,
                        }
                    })
                    return categories
                }
            )

            await page.close()
            console.log('Trinh duyet da dong')
            //Tra lai du lieu
            resolve(categories)
        } catch (error) {
            console.log('loi o scapperCategory' + error)
            reject(error)
        }
    })
const scrappeHeader = (browser, url) =>
    new Promise(async (resolve, reject) => {
        try {
            const page = await browser.newPage()
            console.log('mo trinh duyet moi')
            await page.goto(url)
            console.log('Dang di toi :' + url)
            await page.waitForSelector('#main')
            console.log('Da load xong ')
            const headerData = await page.$eval('header', (elm) => {
                return {
                    title: elm.querySelector('h1').innerText,
                    description: elm.querySelector('p').innerText,
                }
            })
            console.log(headerData)
            await page.close()
            console.log('Trinh duyet da dong')
            resolve()
            //Tra lai du lieu
        } catch (error) {
            console.log('loi o scapperCategory' + error)
            reject(error)
        }
    })

const scrapper = async (browser, url) =>
    new Promise(async (resolve, reject) => {
        try {
            const page = await browser.newPage()
            await page.goto(url)
            await page.waitForSelector('#main')
            const scrapperData = {}
            // Lay header data
            const headerData = await page.$eval('header', (elm) => {
                return {
                    title: elm.querySelector('h1').innerText,
                    description: elm.querySelector('p').innerText,
                }
            })
            // Luu du lieu vao ob
            scrapperData.header = headerData
            //Lay linksData
            const linksData = await page.$$eval(
                '#left-col >.section-post-listing >ul>li h3',
                (els) => {
                    linksData = els.map((el) => {
                        return el.querySelector('a').href
                    })
                    return linksData
                }
            )
            const scrapperDetail = async (link) =>
                new Promise(async (resolve, reject) => {
                    try {
                        const newpage = await browser.newPage()
                        await newpage.goto(link)
                        console.log('>> Đang ở link:' + link)
                        await newpage.waitForSelector('#main')
                        //Tao bien chua
                        const detailData = {}
                        // Lay du lieu hinh anh
                        const images = await newpage.$$eval(
                            '#left-col > article > .post-images > .images-swiper-container >.swiper-wrapper >.swiper-slide',
                            (els) => {
                                images = els.map((el) => {
                                    if (el.querySelector('img'))
                                        return el.querySelector('img').src
                                    return el.querySelector('video').source
                                })
                                return images
                            }
                        )
                        detailData.images = images
                        // Lay du lieu title
                        const header = await newpage.$eval(
                            '#left-col > article > .page-header',
                            (el) => {
                                return {
                                    star: el
                                        .querySelector('h1 > span')
                                        ?.className.replace(/^\D+/g, ''),
                                    description:
                                        el.querySelector('h1 > a').innerText,
                                    category:
                                        el.querySelector('p > a > strong')
                                            .innerText,
                                    address:
                                        el.querySelector('address').innerText,
                                    detail: {
                                        price: el.querySelector(
                                            'div.post-attributes > div.price >span'
                                        ).innerText,
                                        acreage: el
                                            .querySelector(
                                                'div.post-attributes > div.acreage >span'
                                            )
                                            .innerText.replace('m2', ''),
                                        published: el.querySelector(
                                            'div.post-attributes > div.published >span'
                                        ).title,
                                        hashtag: el.querySelector(
                                            'div.post-attributes > div.hashtag >span'
                                        ).innerText,
                                    },
                                }
                            }
                        )

                        detailData.header = header
                        // Thông tin chi tiết
                        const mainContent = await newpage.$$eval(
                            '#left-col > article >section.post-main-content > .section-content p',
                            (els) => {
                                const data = els.map((el) => el.innerText)
                                return data
                            }
                        )
                        detailData.mainContent = mainContent
                        // Đặc điểm tin đăng
                        const overview = await newpage.$$eval(
                            '#left-col > article >section.post-overview > .section-content >table >tbody >tr',
                            (els) => {
                                const data = els.map((el) => {
                                    return {
                                        name: el.querySelector('td:first-child')
                                            .innerText,
                                        content:
                                            el.querySelector('td:last-child')
                                                .innerText,
                                    }
                                })
                                return data
                            }
                        )
                        detailData.overview = overview
                        //Thong tin lien he

                        const contact = await newpage.$$eval(
                            '#left-col > article >section.post-contact > .section-content >table >tbody >tr',
                            (els) => {
                                const data = els.map((el) => {
                                    return {
                                        name: el.querySelector('td:first-child')
                                            .innerText,
                                        content:
                                            el.querySelector('td:last-child')
                                                .innerText,
                                    }
                                })
                                return data
                            }
                        )
                        detailData.contact = contact
                        // Địa chỉ google map
                        const addressMap = await newpage.$eval(
                            '#left-col > article >section.post-map >div.section-header>address',
                            (el) => {
                                return el.innerText.slice(8, -1)
                            }
                        )
                        detailData.addressMap = addressMap

                        // Dong page
                        await newpage.close()
                        resolve(detailData)
                    } catch (error) {
                        console.log('loi lay detail ' + error)
                        reject(error)
                    }
                })
            const details = []
            for (let link of linksData) {
                const detail = await scrapperDetail(link)
                details.push(detail)
            }
            scrapperData.details = details

            resolve(scrapperData)
        } catch (error) {
            reject(error)
        }
    })
module.exports = {
    scrappeCategory,
    scrappeHeader,
    scrapper,
}
