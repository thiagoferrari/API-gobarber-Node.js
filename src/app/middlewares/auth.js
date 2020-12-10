/* o objetivo aqui é bloquear users que estão não estão autenticados (não possuem token)  */

import jwt from 'jsonwebtoken'
import { promisify } from 'util'

import authConfig from "../../config/auth"

export default async (req, res, next) => {
    const authHeader = req.headers.authorization

    // se for verdade que a request feita não tem token, então..
    if (!authHeader) {
        return res.status(401).json({ error: 'token not provided' })
    }

    // SE TUDO DER CERTO..
    // abaixo dividimos(split) pegando somente o token (macete da vírgula - [,token]):
    const [, token] = authHeader.split(' ')


    // try, catch maluco abaixo para verificar se vai conseguir decifrar o token:
    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret)

        // se o código vir até aqui, token decodificado..

        // abaixo deixamos então para os users logados, o userId que está por trás do payLoad() do token.
        req.userId = decoded.id

        return next()
    } catch (err) {
        return res.status(401).json({ error: 'Token Invalid' })
    }
} 