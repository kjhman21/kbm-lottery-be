const router = require('express').Router();
const { DB } = require('../models');
const mintStatusEnum = require('../common/mint_status_enum');
const Caver = require('caver-js');
const { validateTimestamp, checkDefined } = require('../utils/common');
const { verifyAdmin } = require('./utils');

router.post('/', async (req, res) => {
    try {
        var klaytnAddress = req.body.klaytnAddress;
        var signature = req.body.signature;
        var message = req.body.message;
        var timestamp = req.body.timestamp;

        checkDefined(req.body, [
            'klaytnAddress',
            'signature',
            'message',
        ])

        if(!verifyAdmin(klaytnAddress)) {
            throw "not admin account";
        }

        if(message !== "list_uuid") {
            throw "wrong message"
        }
        
        if(!validateTimestamp(timestamp)) {
            throw "timestampe valid"
        }

        message += timestamp;

        // verify signature with klaytnAddress.
        var caver = new Caver(process.env.KLAYTN_ENDPOINT)
        var decodedSignature = caver.utils.decodeSignature(signature)
        if(! await caver.validator.validateSignedMessage(message, decodedSignature, klaytnAddress)) {
            throw "signature verification failed";
        }

        // check if the given uuid exists.
        var r = await DB.MintStatus.findAll({attributes:[
            'uuid'
        ]});
        r = r.map(x=>x.uuid);
        
		res.send(r);
    } catch(err) {
        console.error(err);
		res.status(500).send({error:err.toString()});
    }
});

module.exports = router;