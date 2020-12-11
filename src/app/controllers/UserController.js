// Código responsa por proceder com o req, res que foi passado pela rota

/* Abaixo dentro do yup (framework de schema validation),
        não temos export.default, portanto procedemos com o seguinte:*/
import * as Yup from 'yup'

import User from '../models/User'

class UserController {

    // store: responsa por criar usuário
    async store(req, res) {
        // ANTES DE TUDO, VALIDAÇÕES:

        /*abaixo o Yup espera um objeto (será o req.body) que tenha esta shape:*/
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6), //min carac.
        })

        // dito isso, se for verdade que o isValid deu erro, então:
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails.' })
        }



        // VERIFICAÇÃO: o e-mail passado no req já existe ?:
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
        // ANTES DE TUDO, VALIDAÇÕES(código copiado do store-criação):

        /*abaixo o Yup espera um objeto (será o req.body) que tenha esta shape:*/
        const schema = Yup.object().shape({
            /* sem required(): não é toda vez que o user edita nome*/
            name: Yup.string(),

            /* .required(), não é toda vez que o user edita nome*/
            email: Yup.string().email(),

            /* somente quando o user informar o oldPassword, password deve ser required
                        (se informar ele quer trocar)*/
            oldpassword: Yup.string().min(6),

            /* Yup abaixo que depende de oldpassword para ser required */
            password: Yup.string().min(6).when( //quando..
                'oldpassword', (oldpassword, field) =>
                oldpassword ? field.required() : field
                /*sobre o if acima: se oldpassword for informado [?],
                 então field (password) é required senão[:] field normal sem required!*/
            ),

            /* Yup abaixo para confirmação de senhas */
            confirmPassword: Yup.string().when( //quando..
                'password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('password')]) : field
                /*sobre o if acima: se password for informado [?],
                 então field (confirmPassword) é required ,
                 ^ este .oneOf diz que confirmPassword tem que se referenciar[Yup.ref]
                          em password, sendo assim iguais.                 
                 
                 senão[:] deixa o field normal sem required!*/
            )

        })

        // dito isso, se for verdade que o isValid deu erro, então:
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validations fails.' })
        }



        // aqui vamos capturar o que vem do JSON:
        const { email, oldPassword } = req.body

        // buscando dentro do banco o user que será modificado:
        const user = await User.findByPk(req.userId)

        // VERIFICAÇÃO: o email do req é dif. do banco (se for ele quer trocar)?
        if (email !== user.email) {
            const userExists = await User.findOne({ where: { email } })
            if (userExists) {
                return res.status(400).json({ error: 'User already exists.' })
            }
        }

        // VERIFICAÇÃO:
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