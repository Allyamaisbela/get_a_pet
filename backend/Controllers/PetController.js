//helpers
const getToken = require('../helpers/get-token')
//library
const jwt = require('jsonwebtoken')
//PetController
const Pet = require('../Model/Pet')
const User = require('../Model/User')
const ImagePet = require('../Model/ImagePet')
const { json } = require('sequelize')

module.exports = class PetController {

    //criar um novo pet
    static async create(req, res) {
        const { name, age, weight, color } = req.body

        const available = true

        if (!name) {
            res.status(422).json({ message: 'O nome é obrigatório' })
            return
        }
        if (!age) {
            res.status(422).json({ message: 'O age é obrigatório' })
            return
        }
        if (!weight) {
            res.status(422).json({ message: 'O weigth é obrigatório' })
            return
        }
        if (!color) {
            res.status(422).json({ message: 'O color é obrigatório' })
            return
        }

        //pegando o Id do criador do pet 
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        //criando um novo pet
        const pet = new Pet({
            name: name,
            age: age,
            weight: weight,
            color: color,
            available: available,
            UserId: currentUser.id
        })

        try {
            const newPet = await pet.save()
            res.status(201).json({ message: 'Pet Cadastrado com sucesso', newPet })
        } catch (error) {
            res.status(500).json({ message: error })
        }

    }
    //buscar todos os pets 
    static async getAll(req, res) {
        const pets = await Pet.findAll({ order: [['createdAt', 'DESC']] })
        res.status(200).json({ pets: pets })
    }

    //buscar pets cadastrados pelo usuario
    static async getAllUserPets(req, res) {
        //verificar o usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        const pets = await Pet.findAll({ where: { UserId: currentUserId }, order: [['createdAt', 'DESC']] })

        res.status(200).json({ pets })
    }
    //buscar pet 
    static async getPetById(req, res){
        //buscar id da URL
        const id = req.params.id 

        if (isNaN(id)){ 
            res.status(422).json({message: 'ID invalido'})
            return
        }

        const pet = await Pet.findByPk(id)

        if(!pet){
            res.status(422).json({message: 'Pet não existe'})
            return
        }

        res.status(200).json({ pet: pet })

    }

    static async removePetById(req, res){
        const id = req.params.id 

        if (isNaN(id)){ 
            res.status(422).json({message: 'ID invalido'})
            return
        }

        const pet = await Pet.findByPk(id)

        if(!pet){
            res.status(422).json({message: 'Pet não existe'})
            return
        }

        //verificar o usuario logado
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)
        currentUser.password = undefined
        const currentUserId = currentUser.id

        if (Number(pet.UserId) !== Number (currentUserId) ){
            res.status(422).json({ message: 'Id Invalido '})
            return
        }

        await Pet.destroy({ where: { id: id} })
        res.status(200).json({ message: 'Pet destruido com sucesso' })

    }

    static async uptadePet(req, res){
        const id = req.params.id
        const { name, age, weight, color } = req.body
        const uptadePet = {}
        const pet = await Pet.findByPk(id)
        if(!pet){
            res.status(404).json({message: 'Pet não existe!!'})
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if(pet.UserId !== currentUser.id){
            res.status(422).json({message: 'ID invalido'})
            return
        }

        if(!name){
            res.status(422).json({message: 'O nome é obrigatório'})
            return
        } else {
            updatedPet.name = name
        }
        if(!age){
            res.status(422).json({message: 'O age é obrigatório'})
            return
        }  else {
            updatedPet.age = age
        }
        if(!weight){
            res.status(422).json({message: 'O weight é obrigatório'})
            return
        } else {
            updatedPet.weight = weight

        }
        if(!color){
            res.status(422).json({message: 'O color é obrigatório'})
            return
        } else {
            updatedPet.color = color

        }

        //trabalhar com as imagens
        const images = req.files
        if(!images || images.lenght === 0){
            res.status(422).json({message: 'As imagens são obrigatorios!!'})
            return
        } 
            //atualizar as imagens do pet
            const imageFilename = images.map((image) => image.Filename) 
            //remover imagens antigas
            await ImagePet.destroy({where: {PetId: pet.id} })
            //adicionar novas imagens
            for (let i = 0; i < imageFilename.lenght; i++){
                const filename = imageFilename[i]
                const newImagePet = new ImagePet({ image: filename, PetId: pet.id })
                await newImagePet.save()
            }

            await Pet.update(updatedPet, { where: {id: id} })
            res.status(200).json({message: 'Pet atualizado com sucesso'})
        }

        //agendamento de pet
        static async schedule(req, res){

        const id = req.params.id
        const pet = await Pet.findByPk(id)
        if(!pet){
            res.status(404).json({message: 'Pet não existe!!'})
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if(pet.UserId === currentUser.id){
            res.status(422).json({message: 'O pet ja é seu'})
            return
        }

        //checar se o usuario ja agendou a visita
        if(pet.adopter){
            if(pet.adopter === currentUser.id){
                res.status(422).json({message: 'Voce ja agendou uma visita'})
                return
            }
        }
        pet.adopter = currentUser.id

        await pet.save()

        res.status(200).json({message: 'Pet adotado com sucesso'})
    }

    static async concludeAdoption(req, res){

        const id = req.params.id
        const pet = await Pet.findByPk(id)
        if(!pet){
            res.status(404).json({message: 'Pet não existe!!'})
            return
        }

        //pegando o dono do pet
        let currentUser
        const token = getToken(req)
        const decoded = jwt.verify(token, 'nossosecret')
        currentUser = await User.findByPk(decoded.id)

        if(pet.UserId !== currentUser.id){
            res.status(422).json({message: 'ID inválido'})
            return
        }
        pet.available = false
        await pet.save()
        res.status(200).json({message: 'Adoção concluída !!'})
        
    }
    static async getAllUserAdoptions(req, res){
        
                //pegando o dono do pet
                let currentUser
                const token = getToken(req)
                const decoded = jwt.verify(token, 'nossosecret')
                currentUser = await User.findByPk(decoded.id)

                const pets = await Pet.findAll({
                    where: {adopter: currentUser.id},
                    order: [['createdAt', 'DESC']]
                })
                res.status(200).json({ pets })
    }

}

