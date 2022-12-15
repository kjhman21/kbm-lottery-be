const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { DB } = require('../models');
const mintStatusEnum = require('../common/mint_status_enum');

router.post('/uuid', async (req, res) => {
    try {
        var n = req.body.num;
        for(var i = 0;i < n; i++) {
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