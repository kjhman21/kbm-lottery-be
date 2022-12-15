require('dotenv').config({path:'../'})
function validateTimestamp(timestamp) {
    if(!timestamp) {
        throw "required: timestamp";
    }

    var d = new Date(parseInt(timestamp));
    var now = new Date();

    if(d > now) {
        throw "newer than now"
    }

    if(now - d > process.env.TIMESTAMP_TTL_MS) {
        throw "timestamp is too old"
    }

    return true;
}

function checkDefined(body, params) {
    params.map(x=> {
        if(!body[x]) {
            throw `required: ${x}`
        }
    })

    return true;
}

module.exports = {
    validateTimestamp,
    checkDefined
}