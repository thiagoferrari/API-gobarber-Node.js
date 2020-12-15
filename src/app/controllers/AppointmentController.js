import Appointment from '../models/Appointment'
import * as Yup from 'Yup'
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns'
import pt from 'date-fns/locale/pt'
import User from '../models/User'
import File from '../models/File'
import Notification from '../schemas/Notification'

import Mail from '../../lib/Mail'

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
         * checando se o provider_id escolhido existe:
         */
        const checkisProvider = await User.findOne({
            where: { id: provider_id, provider: true }
        })

        if (!checkisProvider) {
            return res.status(401).json({ error: 'Você pode somente agendar com provedores' })
        }


        /**
         * checagem: se user logado é igual ao user que ocorrerá o agendam.
         *                              (não pode marcar consigo mesmo)
         */
        if (req.userId == provider_id) {
            return res.status(401).json({ error: 'Você não pode agendar consigo mesmo' })
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


        /**
         * NOTIFICAR PRESTADOR DE AGENDAMENTO:
         */
        const user = await User.findByPk(req.userId);

        /* preparando mensagem de data: */
        const formattedDate = format(
            hourStart, // a do agendamento está aqui!
            "'dia' dd 'de' MMMM', às' H:mm'h'", // essa é a 'máscara' que a data recebe
            {
                locale: pt,
            }
        );

        /* insert no banco: */
        await Notification.create({
            content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
            user: provider_id,
        });


        return res.json(appointment)
    }

    async delete(req, res) {
        // buscando agendamento no banco (linha):
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [ // select de dados do cancelamento [uso no e-mail]
                {
                    model: User,
                    as: 'provider', // preciso usar o 'as' devido as duas FK no model Appointment
                    attributes: ['name', 'email']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name']
                }
            ]
        })

        // se o user que está tentando cancelar não for o que criou..:
        if (appointment.user_id !== req.userId) {
            return res.status(401).json({
                error: 'voce não tem permissão para cancelar este agendamento'
            })
        }

        /** 
         * CANCELAMENTO DE AGENDAMENTOS
         */
        // aqui vou diminuir -2 horas do hr agendado
        const dateWithSub = subHours(appointment.date, 2)

        // bloqueando cancelamentos 2 hr antes do agendamento:
        if (isBefore(dateWithSub, new Date())) {
            return res.status(401).json({
                error: 'você somente pode cancelar um agendam. até duas horas antes de ocorrer'
            })
        }

        const NOW = new Date().toJSON()
        appointment.canceled_at = NOW

        // commit no mongo com os dados alterados:
        await appointment.save()


        /**
         * FUNÇÃO QUE DISPARA E-MAIL DEPOIS DE CANCELAR AGENDAMENTO:
         */
        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: { //variáveis que serão usadas dentro do corpo do email:
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format(appointment.date, // a do agendamento está aqui!
                    "'dia' dd 'de' MMMM', às' H:mm'h'", // essa é a 'máscara' que a data recebe
                    {
                        locale: pt,
                    }),
            },
        })

        return res.json(appointment)
    }
}

export default new AppointmentController()