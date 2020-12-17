// a partir do node 14 se pode usar o import

import express from 'express'
import path from 'path'
import Youch from 'youch'
import * as Sentry from '@sentry/node'
import 'express-async-errors'
import sentryConfig from './config/sentry'

import routes from './routes'
import './database'

class App {
    constructor() {
        this.server = express()

        Sentry.init(sentryConfig)

        this.middlewares()
        this.routes()
        this.exceptionHandler()
    }

    middlewares() {
        //aqui se INICIA o rastreamento por erros: (é executado antes de todas rotas)
        this.server.use(Sentry.Handlers.requestHandler());

        this.server.use(express.json())
        /* url para facilitar ao front-end ver o avatar:
                e aqui vamos usar o express.static para servir arquivos estáticos (png, css, etc.)*/
        this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
    }

    routes() {
        this.server.use(routes)

        //aqui se encerra o rastreamento por erros:
        this.server.use(Sentry.Handlers.errorHandler())
    }


    /**
     * FUNÇÃO RESPONSA: retornar msg de erro se algo ser errado
     */
    exceptionHandler() {
        // express entende que middlewares com 4 params é p/ tratar erros:
        this.server.use(async (err, req, res, next) => {

            // o youch vai retornar os erros [ele irá para o front-end]
            const errors = await new Youch(err, req).toJSON()

            return res.status(500).json(errors)
        })
    }
}

export default new App().server