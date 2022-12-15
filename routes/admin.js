const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { DB } = require('../models');
const mintStatusEnum = require('../common/mint_status_enum');
const { checkDefined } = require('../utils/common');

router.post('/uuid', async (req, res) => {
    try {
        var klaytnAddress = req.body.klaytnAddress;
        var signature = req.body.signature;
        var message = req.body.message;
        var timestamp = req.body.timestamp;
        var num = req.body.num;

        checkDefined(req.body, [
            'num',
            'klaytnAddress',
            'signature',
            'message',
        ])

        if(message !== "uuid") {
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

        for(var i = 0;i < num; i++) {
            var uuid = uuidv4();

            DB.MintStatus.create({
                uuid,
                status: mintStatusEnum.NOT_MINTED,
                klaytnAddress: ""
            })
        }
		res.sendStatus(200);
    } catch(err) {
        console.error(err);
		res.status(500).send({error:err.toString()});
    }
})

module.exports = router;