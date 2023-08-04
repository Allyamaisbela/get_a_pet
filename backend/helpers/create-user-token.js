const jwt = require('jsonwebtoken')
//criando token do user
async function createUserToken(user, req, res){

    //gerar o token
    const token = jwt.sign({
        name: user.name,
        id: user.id
    }, 'nossosecret')

    res.status(200).json({
        message: 'Voce esta autenticado',
        token: token,
        userId: user.id
    })
}
module.exports = createUserToken