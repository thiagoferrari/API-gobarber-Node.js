/**
 * A PASTA JOBS VAI TER TODOS OS BACKGROUND JOBS
 */

import { format, parseISO } from 'date-fns'
import pt from 'date-fns/locale/pt'
import Mail from '../../lib/Mail'

class CancellationMail {
    get key() { /* usando get podemos usar direto: CancellationMail.key */
        return 'CancellationMail'
    }

    // handle será usado para cada e-mail de cancelamento
    async handle({ data }) {
        const { appointment } = data

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
                date: format(parseISO(appointment.date), // a do agendamento está aqui!
                "'dia' dd 'de' MMMM', às' H:mm'h'", // essa é a 'máscara' que a data recebe
                    {
                locale: pt,
            }),
            },
})
    }
}

export default new CancellationMail()