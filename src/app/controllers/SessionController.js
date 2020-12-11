// estamos criando uma Sessão e por isso vamos criar um novo controler 

import jwt from 'jsonwebtoken'
import * as Yup from 'yup'

import User from '../models/User'
import authConfig from '../../config/auth'

class SessionController {
    async store(req, res) {
        // ANTES DE TUDO, VALIDAÇÕES:

        /*abaixo o Yup espera um objeto (será o req.body) que tenha esta shape:*/
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(), //min carac. não precisa
        })

        // dito isso, se for verdade que o isValid deu erro, então:
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails.' })
        }

        

        const { email, password } = req.body

        // VERIFICAÇÕES:
        // 1º: verificando se o email passado existe:
        const user = await User.findOne({ where: { email } })

        // se verdade que não existe nenhum email:
        if (!user) {
            return res.status(401).json({ error: 'User not found' })
        }


        // 2º: verificando se a senha está Ok
        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'password does not match' })
        }

        // se der tudo certo, passando por todos ifs, vamos validar com o token

        const { id, name } = user

        // retornando dados para o front-end
        return res.json({
            user: {
                id,
                name,
                email,
            },
            //montando token abaixo com: { id }, secret(somente no meu app), data de expiração
            token: jwt.sign({ id }, authConfig.secret, { expiresIn: authConfig.expiresIn }),
        })

    }
}

export default new SessionController();