const startBrower = require("./brower")
const scrapperController = require('./scrapperController')

let brower = startBrower()
scrapperController(brower)