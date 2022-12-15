const {Model, DataTypes, Sequelize} = require("sequelize");

class MintStatus extends Model {}

module.exports = (sequelize) => {
    MintStatus.init({
        uuid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        // 0: not minted
        // 1: minted
        // 2: burnt
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        klaytnAddress: {
            type: DataTypes.STRING,
        }
    },{
        sequelize: sequelize,
        modelName: 'mintStatus',
        charset:'utf8',
        collate:'utf8_unicode_ci',
		indexes:[{fields:['uuid']},{fields:['klaytnAddress']}]
    });

    return {MintStatus};
}