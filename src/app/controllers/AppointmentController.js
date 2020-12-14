import Appointment from '../models/Appointment'
import * as Yup from 'Yup'
import { startOfHour, parseISO, isBefore } from 'date-fns'
import User from '../models/User'
import File from '../models/File'

class AppointmentController {
    /**
     * index abaixo para listar todos agendamentos de um user
     */
    async index(req, res) {
        const { page = 1 } = req.query // por default o query params recebe a page 1

        const appointments = await Appointment.findAll({
            where: { user_id: req.userId, canceled_at: null }, // agenda. não cancelados
            order: [['date', 'DESC']],
            attributes: ['id', 'date'],

            /* controlando itens por página: */
            limit: 20, // o banco vai limitar a busca em 20 itens
            offset: (page - 1) * 20, // offset controla quantas linhas vai pular no select

            include: [ // a partir da FK entre Appointment e User, me traga(include) os seguintes dados:
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id', 'name'],
                    include: [ // a partir da FK entre User e File, me traga(include) os seguintes dados:
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id', 'path', 'url']
                        }
                    ]
                }
            ]
        })

        return res.json(appointments)
    }

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
        const checkisProvider = await User.findOne({
            where: { id: provider_id, provider: true }
        })

        if (!checkisProvider) {
            return res.status(401).json({ error: 'Você pode somente agendar com provedores' })
        }


        /**
         * checando: marcar em dias anteriores ao atual [Usando date-fns]
         */

        /*parseISO converte date em obj para ser lido em startOfHour:
        start sempre em 00:00 (sem min e seg.)*/
        const hourStart = startOfHour(parseISO(date))

        if (isBefore(hourStart, new Date())) { //isBefore recebe 2 param. e compara:
            return res.status(400).json({ error: "marcar em dias anteriores ao atual não é permitido" })
        }


        /**
         * checando se prestador está com horário escolhido disponível
         */

        /* select no banco procurando por este horário: */
        const checkAvailability = await Appointment.findOne({
            where: {
                provider_id,
                canceled_at: null,
                date: hourStart,
            }
        })

        if (checkAvailability) {
            return res.status(400).json({ error: "horário não disponível" })
        }


        /**
         *  SE DER TUDO CERTO, PROSSEGUIR COM INSERT NO BANCO:
         */
        const appointment = await Appointment.create({
            user_id: req.userId, // obtenho esse valor lá nas rotas..
            provider_id,
            date: hourStart, // hourStart aqui garante o 00:00 
        })

        return res.json(appointment)


    }
}

export default new AppointmentController()