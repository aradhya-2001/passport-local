// https://www.rfc-editor.org/rfc/rfc8018 -> 5.2
const crypto=require("crypto")

function genPassword(password){
    const salt=crypto.randomBytes(32).toString("hex")
    const hash=crypto.pbkdf2Sync(password,salt,10000, 64, "sha512").toString("hex")

    return{
        salt:salt,
        hash:hash
    }
}

function validPassword(password, hash, salt){
    let hashCheck=crypto.pbkdf2Sync(password,salt,10000, 64, "sha512").toString("hex")
    return hash===hashCheck
}

module.exports.genPassword=genPassword
module.exports.validPassword=validPassword
