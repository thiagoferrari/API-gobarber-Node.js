import { Router } from 'express'

import UserController from './app/controllers/UserController'

const routes = new Router()

// aqui vamos tratar a req, res pelo UserController.store:
routes.post('/users', UserController.store)

export default routes