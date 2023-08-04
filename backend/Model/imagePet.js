const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const Pet = require('./Pet')

const ImagePet = db.define('ImagePet', {
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

//a imagem pertence a 1 pet
ImagePet.belongsTo(Pet)
//um pet tem varias images
Pet.hasMany(ImagePet)

module.exports = ImagePet