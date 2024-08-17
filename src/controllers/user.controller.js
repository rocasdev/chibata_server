import {User} from '../models/user.model.js'

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' })
    }
}

export const getUser = async (req, res) => {
    try {
        const id = req.params.id
        const user = await User.findByPk(id)
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' + error })
    }
}

export const postUser = async (req, res) => {
    try {
        const u = req.body
        await User.create({ name: u.name, last_name: u.last_name, doc: u.doc, email: u.email, pass: u.pass, role_id: u.role })
        res.status(200).json({ message: 'Usuario creado correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario' + error })
    }
}

export const putUser = async (req, res) => {
    try {
        const id = req.params.id
        const u = req.body
        await User.update({ 
            name: u.name, last_name: u.last_name, doc: u.doc, email: u.email, pass: u.pass, role_id: u.role
        }, {
            where: {
                id: id
            }
        })
        res.status(200).json({ message: 'Usuario actualizado correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' + error })
    }
}

export const delUser = async (req, res) => {
    try {
        const id = req.params.id
        await User.destroy({ where: { id: id } })
        res.status(200).json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' + error })
        
    }
}