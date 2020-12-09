import Router from 'express'
import User from './app/models/User'

const routes = new Router()

//             aqui precisamos do async devido a volta do banco poder demorar um pouco
routes.get('/', async (req, res) => {

    // aqui vamos fazer um breve teste de input dentro do banco:
    const user = await User.create({
        name: 'THIAGO FERRARI',
        email: 'THIAGOFERRARI@GMAIL.COM',
        password_hash: '123456789',
    })

    return res.json(user)
})

export default routes