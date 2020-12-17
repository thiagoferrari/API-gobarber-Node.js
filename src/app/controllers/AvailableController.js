import {
    startOfDay,
    endOfDay,
    setHours,
    setMinutes,
    setSeconds,
    format,
    isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

/**
 * CÓDIGO PARA BUSCAR HORÁRIOS QUE PRESTADOR TEM, E SE ESTÃO AGENDADOS/OU NÃO:
 */
class AvailableController {
    async index(req, res) {
        // aqui pegamos a chave timestamp (devido ao front-end não funfar DD-MM-AAAA)
        const { date } = req.query // new Date().getTime() [no console do browser para testes]

        //  conferindo se data está Ok:
        if (!date) {
            return res.status(400).json({ error: 'Invalid date' })
        }

        const searchDate = Number(date) // convertendo data timestamp

        /**
         * Select no banco procurando por agendam. iguais a este timestamp
         */
        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.params.providerId,
                canceled_at: null,
                date: {
                    [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)]
                }
            }
        })

        /* horários que o prestador pode atender:
    (poderíamos ter uma table para isso, guardando os horários que o prestador QUER pode atender) */
        const schedule = [
            '08:00', // 2021-01-01 08:00:00
            '09:00', // 2021-01-01 09:00:00
            '10:00', // 2021-01-01 10:00:00
            '11:00', // ...
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
        ];

        /**
         * em available vamos percorrer o schedule e fazer o seguinte:
         * converter as datas para esta máscara: 2021-01-01 08:00:00..
         * dentro do where verificar se:
            * o Horário ITerado(HIT) não tem ninguém já marcado
            * ver se o HIT já passou
         */
        const available = schedule.map(time => {
            // split no HIT para separar horas de minutos:
            const [hour, minute] = time.split(':')

            // completar no horário : 2021-01-01 08:00:00..:
            const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0)

            // converter as datas para o front-END, corrigindo +3 do timestamp
            return {
                time,
                value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
                available: // se ele voltar false, o HIT não está disponível:

                    //ver se o HIT acontec. depois da data atual
                    isAfter(value, new Date())

                    && // AND

                    /*ver se algum horário no array schedule não está contido no select de appointments:
                        (se não tiver, o horário já esta ocupado por outra pessoa)*/
                    !appointments.find(a => format(a.date, 'HH:mm') === time),
            }
        })

        return res.json(available)
    }
}

export default new AvailableController()