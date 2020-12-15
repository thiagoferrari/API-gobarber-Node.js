import User from '../models/User'
import Notification from '../schemas/Notification'

class NotificationController {
    async index(req, res) {

        /**
         * checando se este usuário logado é um prestador:
         */
        const checkisProvider = await User.findOne({
            where: { id: req.userId, provider: true }
        })

        // se não for prestador:
        if (!checkisProvider) {
            return res.status(401).json({ error: 'Somente prestadores podem ver notificações' })
        }


        /**
         * SE DER TUDO CERTO, SELECT NO MONGO BUSCANDO AS NOTIF.
         */
        const notifications = await Notification.find({
            user: req.userId
        })
            .sort({ createdAt: 'desc' })
            .limit(20)

        return res.json(notifications)
    }

    async update(req, res) {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id, //é o id do registro no mongo que foi passado como parâm. na query do frontend
            { read: true }, // aqui falo que o campo read recebe true
            { new: true } // aqui retornamos o registro alterado
        )

        return res.json(notification)
    }
}

export default new NotificationController()