const { v4: uuidv4 } = require('uuid');
const { DB } = require('../models');
const num_uuids = 10;

async function generate(num_uuids) {
    for(var i = 0;i < num_uuids; i++) {
        var uuid = uuidv4();

        DB.MintStatus.create({
            uuid,
            status: 0,
            klaytnAddress: ""
        })
    }
}

generate(num_uuids);