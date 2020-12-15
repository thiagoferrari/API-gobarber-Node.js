/**
 * ARQUIVO RESPONSA POR MONTAR CORPO DO E-MAIL
 */

import nodemailer from 'nodemailer'
import mailConfig from '../config/mail'

class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null // null para o caso de conex. sem autenticação
        })
    }

    /**
     * sendMail é a função responsa por disparar. nela vou concat. o destinatário + corpoMsg
     */
    sendMail(corpoMsg) {
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...corpoMsg,
        })
    }
}

export default new Mail()