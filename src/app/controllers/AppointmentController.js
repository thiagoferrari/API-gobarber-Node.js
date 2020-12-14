import Appointment from '../models/Appointment'
import * as Yup from 'Yup'
import User from '../models/User'


class AppointmentController {
    async store(req, res) {
        /**
         * VALIDAÇÕES:
         */
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required(),
        })

        /**
         * SE O req.body for válido de acordo com o schema:
         */
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: "Validation fails" })
        }

        const { provider_id, date } = req.body

        /**
         * checando se este provider_id existe:
         */
        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true }
        })

        if (!isProvider) {
            return res.status(401).json({ error: 'Você pode somente agendar com provedores' })
        }

        /**
         *  SE DER TUDO CERTO, PROSSEGUIR COM INSERT NO BANCO:
         */
        const appointment = await Appointment.create({
            user_id: req.userId, // obtenho esse valor lá nas rotas..
            provider_id,
            date,
        })

        return res.json(appointment)


    }
}

export default new AppointmentController()