const router = require('express').Router();
const { DB } = require('../models');
const mintStatusEnum = require('../common/mint_status_enum');
const Caver = require('caver-js');
const { checkDefined, validateTimestamp } = require('../utils/common');
const kip17abi = require('../utils/kip17abi.json');

router.post('/', async (req, res) => {
    try {
        var uuid = req.body.uuid;
        var klaytnAddress = req.body.klaytnAddress;
        var signature = req.body.signature;
        var message = req.body.message;
        var timestamp = req.body.timestamp;

        checkDefined(req.body, [
            'uuid',
            'klaytnAddress',
            'signature',
            'message',
        ])

        if(message !== "mint") {
            throw "wrong message"
        }
        
        if(!validateTimestamp(timestamp)) {
            throw "timestampe valid"
        }

        message += timestamp;

        // check if the given uuid exists.
        const r = await DB.MintStatus.findAll({where:{uuid}});
        if(r.length === 0) {
            throw "uuid not found"
        }
        if(r[0].dataValues.status != mintStatusEnum.NOT_MINTED) {
            throw `status should be NOT_MINTED. (${r[0].dataValues.status})`;
        }

        // verify signature with klaytnAddress.
        var caver = new Caver(process.env.KLAYTN_ENDPOINT)
        var decodedSignature = caver.utils.decodeSignature(signature)
        if(! await caver.validator.validateSignedMessage(message, decodedSignature, klaytnAddress)) {
            throw "signature verification failed";
        }

        // 1 KLAY airdrop
        const adminKeyring = caver.wallet.keyring.createFromPrivateKey(process.env.ADMIN_PK);
        caver.wallet.add(adminKeyring)

        const tx = await caver.transaction.valueTransfer.create({
            from: adminKeyring.address,
            to: klaytnAddress,
            value: caver.utils.toPeb(5, 'KLAY'),
            gas: 25000,
        })
        await caver.wallet.sign(adminKeyring.address, tx);
        const rlpEncoded = tx.getRLPEncoding();

        // Send the transaction using `caver.rpc.klay.sendRawTransaction`.
        const receipt = await caver.rpc.klay.sendRawTransaction(rlpEncoded)
        console.log(receipt)

        // mint kbm nft
        const kip17 = caver.contract.create(kip17abi, process.env.NFT_CONTRACT_ADDRESS);
        const uri = process.env.NFT_URI;
        await kip17.methods.safeMint(klaytnAddress, uri).send({from:adminKeyring.address, gas:10000000})

        await DB.MintStatus.update({
            status: mintStatusEnum.MINTED,
            klaytnAddress
        },{
            where:{ uuid }
        })
        
		res.sendStatus(200);
    } catch(err) {
        console.error(err);
		res.status(500).send({error:err.toString()});
    }
});

module.exports = router;