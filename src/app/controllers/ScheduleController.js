import { startOfDay, endOfDay, parseISO } from 'date-fns'
import { Op } from 'sequelize'

import Appointment from '../models/Appointment'
import User from '../models/User'

class ScheduleController {
    async index(req, res) {
        /**
         * checando se o user logado é provider
         */
        const checkUserProvider = await User.findOne({
            where: { id: req.userId, provider: true }
        })

        if (!checkUserProvider) {
            return res.status(400).json({ error: 'O usuário logado não é um provedor' })
        }

        /**
         * buscando agendamentos de uma determ. data:
         */
        const { date } = req.query // pegando data passada pelo query params
        const parsedDate = parseISO(date) // convertendo data em obj. javascript

        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                date: { //usando operador between SQL para listar agenda. do dia:
                    [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
                },
            },
            order: [['date', 'ASC']]
        })

        return res.json(appointments)
    }
}

export default new ScheduleController()