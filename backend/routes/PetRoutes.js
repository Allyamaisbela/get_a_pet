const router = require('express').Router()
const PetController = require('../Controllers/PetController')

//helpers
const verifyToken = require('../helpers/verify-token')
const imageUpload = require('../helpers/image-upload')

//rotas privadas
//cadastrar um pet
router.post(
    '/create',
    verifyToken,
    imageUpload.array('imagens'),
    PetController.create)
//mostrar pets do usuario  logado
router.get('/mypets', verifyToken, PetController.getAllUserPets)
//deleter um pet pelo id 
router.delete('/:id', verifyToken, PetController.removePetById)
//editar o pet
router.patch('/:id', verifyToken, imageUpload.array('images'), PetController.uptadePet)
//agendar pet 
router.patch('/schedule/:id', verifyToken, PetController.schedule) 
//concluir adoção
router.patch('/conclude/:id', verifyToken, PetController.concludeAdoption) 
//pet adotados pelo user
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions) 




//rotas publicas
//listar todos os pets
router.get('/', PetController.getAll)
//deletar um pet pelo id 
router.delete('/:id', verifyToken, PetController.removePetById)

router.get('/:id', PetController.getPetById)

module.exports = router