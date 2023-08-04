const multer = require('multer')//gerenciar imagens 
const path = require('path') //gerenciar o caminho dos arquivos
//Aqui sera definido onde os arquivos serão salvos
//O destino das imagens serão definidas aqui 

const imageStorage = multer.diskStorage({
    destination: function(res, file, cd){
        let folder = '' //folder é pasta

        if(req.baseUrl.includes('users')){
            folder = 'users'
        }else if(req.baseUrl.includes('pets')){
            folder = 'pets'
        }

        cb(null, `public/images/${folder}`)

    },
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const imageUpload = multer ({
    storage: imageStorage,
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error('Por favor, envie apenas jpg ou png'))
        }
        cb(null, true)
    }
})

module.exports =  imageUpload 