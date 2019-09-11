#!/usr/bin/env node

const Nightmare = require('nightmare')
const nightmare = Nightmare({show : false})
const chalk = require('chalk')
const log = console.log 

function loading() {
    let loaders = ['|', '/', '-', '\\']
    let start = 0
    return setInterval(() => {
        process.stdout.write("\r" + loaders[start++])
        start %= loaders.length
    }, 250)
}

let load = loading()

nightmare
    .goto('https://summerofcode.withgoogle.com/how-it-works/#timeline')
    // class that contains timeline
    .wait('.vertical-timeline__block')
    .evaluate(() => {
        let len =  document.querySelectorAll('.vertical-timeline__block').length
        let allDetail = []
        // iterate through each timeline
        for(let i = 0; i < len; i++) {
            // get text of timeline -> trim it and split it with nextline
            let singleDetail = document.querySelectorAll('.vertical-timeline__block')[i].textContent.trim().split('\n')
            let detailedObject = {
                // first element is title
                title : singleDetail[0],
                // date should be second element, if there is multiple dates then third and fourth element
                date : singleDetail[1].trim() === "" ? (singleDetail[2].trim() + " , " + singleDetail[3].trim()) : singleDetail[1].trim(),
                // last element is detail
                detail : singleDetail[singleDetail.length - 1].trim()
            }
            allDetail.push(detailedObject)
        }
        return allDetail
    })
    .end()
    .then(data => {
        clearInterval(load)
        process.stdout.write('\r')
        for(let i = 0; i < data.length; i++) {
            let {title, date, detail} = data[i]
            // log all details with beautyyy
            log(chalk.green.bold(title) + " - " + chalk.blue(date) + " : \n" + chalk.yellow(detail) + "\n")
        }
    })
