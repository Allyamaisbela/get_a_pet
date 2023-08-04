const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('get_a_pet', 'root', '',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectado ao banco!!!!')

} catch (error) {
    console.log('Não foi possível conectar: ', error)
}


module.exports = sequelize