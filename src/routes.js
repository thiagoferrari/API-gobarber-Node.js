import { Router } from 'express'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'


const routes = new Router()

// aqui vamos tratar a req, res pelo UserController.store:
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)


export default routes