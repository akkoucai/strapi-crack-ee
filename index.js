#!/usr/bin/env node
const { createSign, createVerify } = require("crypto")
const fs = require("fs")
const { cwd } = require('process')
const path = require('path')

const privateKey = fs.readFileSync(path.join(__dirname, "certs/private.pem")).toString()
const publicKey = fs.readFileSync(path.join(__dirname, "certs/key.pub")).toString()
const data = fs.readFileSync(path.join(__dirname, "data/lic.json")).toString()
const jsData = fs.readFileSync(path.join(__dirname, "js/index.js")).toString()

const sign = createSign("RSA-SHA256")
sign.write(data)
sign.end()

const signature64 = sign.sign(privateKey).toString("base64")
const data64 = Buffer.from(data).toString("base64")

const license = Buffer.from(`${signature64}\n${data64}`).toString("base64")

let fp = null
let fx = null
if(__dirname == cwd() && process.argv[2] == 'init'){
    fp = path.join(__dirname, "../../../license.txt")
    fx = path.join(__dirname, "../../../node_modules/@strapi/strapi/ee/resources/key.pub")
    fw = path.join(__dirname, "../../../node_modules/@strapi/strapi/ee/index.js")
}else{
    fp = path.join(cwd(), 'license.txt')
    fx = path.join(cwd(), 'node_modules/@strapi/strapi/ee/resources/key.pub')
    fw = path.join(cwd(), 'node_modules/@strapi/strapi/ee/index.js')
}
fs.writeFileSync(fp, license)
fs.writeFileSync(fx, publicKey)
fs.writeFileSync(fw, jsData)
console.log(`-> LICENSE saved to ${fp}`)
