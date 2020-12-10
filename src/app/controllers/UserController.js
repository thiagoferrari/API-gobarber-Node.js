// Código responsa por proceder com o req, res que foi passado pela rota

import User from '../models/User'

class UserController {

    // store: responsa por criar usuário
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

    // update: responsa editar dados do usuário
    async update(req, res) {

        // aqui vamos capturar o que vem do JSON:
        const { email, oldPassword } = req.body

        // buscando dentro do banco o user que será modificado:
        const user = await User.findByPk(req.userId)

        // VALIDAÇÃO: o email do req é dif. do banco (se for ele quer trocar)?
        if (email !== user.email) {
            const userExists = await User.findOne({ where: { email } })
            if (userExists) {
                return res.status(400).json({ error: 'User already exists.' })
            }
        }

        // VALIDAÇÃO:
        /* se no json o oldPassword for true (ele quer trocar) AND
                                                    lá dentro do banco esse oldPassword estiver dif. de FALSE então..*/
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match' })
        }

        // Depois de tudo validado, vamos realizar o update, baseado no que foi passado req.body
        const { id, name, provider } = await user.update(req.body)

        return res.json({
            id,
            name,
            email,
            provider
        })
    }

    /* LEMBRE-SE: dentro de checkPassword() tem o bcrypt */
}

export default new UserController();