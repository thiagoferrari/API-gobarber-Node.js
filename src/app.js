// a partir do node 14 se pode usar o import

import express from 'express'
import path from 'path'
import routes from './routes'

import './database'

class App {
    constructor() {
        this.server = express()

        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.server.use(express.json())
        /* url para facilitar ao front-end ver o avatar:
                e aqui vamos usar o express.static para servir arquivos estáticos (png, css, etc.)*/
        this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
    }

    routes() {
        this.server.use(routes)
    }
}

export default new App().server