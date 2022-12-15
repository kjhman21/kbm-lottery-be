require('dotenv').config({path:'../'});
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME,
		process.env.DB_USER,
		process.env.DB_PW,
    {
        host: process.env.DB_HOST,
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
        dialect: process.env.DB_DIALECT
    });

const { MintStatus } = require('./mint_status')(sequelize);

const DB = {
    sequelize,
    Sequelize,
    MintStatus,
}

if(process.env.DB_SYNC == '1')  {
    console.log("synchronizing db schema...")
	sequelize.sync({alter:true}).then(function() {
		console.log("All models were synchronized successfully.");
	});
}

module.exports = {DB};