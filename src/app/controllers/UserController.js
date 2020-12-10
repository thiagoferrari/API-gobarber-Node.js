// Código responsa por proceder com o req, res que foi passado pela rota

import User from '../models/User'

class UserController {
    async store(req, res) {

        // VALIDAÇÃO: o e-mail passado no req já existe ?:
        const userExists = await User.findOne({ where: { email: req.body.email } })
        if (userExists) {
            return res.status(400).json({ error: 'User already exists.' })
        }

        const { id, name, email, provider } = await User.create(req.body)

        // aqui na resposta somente vamos mandar para o front-end alguns dados do usuário:
        return res.json({
            id,
            name,
            email,
            provider,
        })
    }


    async update(req, res) {
        console.log(req.userId) 

        return res.json({ ok: "true" })
    }
}

export default new UserController();