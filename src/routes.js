import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

// importando controllers:
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import FileController from './app/controllers/FileController'
import ProviderController from './app/controllers/ProviderController'
import AppointmentController from './app/controllers/AppointmentController'


import authMiddleware from './app/middlewares/auth'


const routes = new Router()
const upload = multer(multerConfig)

// aqui vamos tratar a req, res pelo UserController.store:
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

/* esse routes.use não interfere em nada acima, só nas rotas embaixo dele!*/
routes.use(authMiddleware)

// rota p/ atualizar users
routes.put('/users', UserController.update)

routes.get('/providers', ProviderController.index)

routes.post('/appointments', AppointmentController.store)

routes.post('/files', upload.single('file'), FileController.store)

export default routes