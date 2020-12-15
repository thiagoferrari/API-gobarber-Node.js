/**
 * ARQUIVO RESPONSA POR MONTAR CORPO DO E-MAIL
 * VAMOS USAR O HANDLEBARS PARA MISTURAR HTML COM AS VAIRÁVEIS EM NODE
 */

import nodemailer from 'nodemailer'
import { resolve } from 'path'
import mailConfig from '../config/mail'
import nodemailerhbs from 'nodemailer-express-handlebars'
import exphbs from 'express-handlebars'

class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null // null para o caso de conex. sem autenticação
        })

        this.configureTemplates()
    }

    configureTemplates() {
        // navegando até onde está a view dos emails:
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails')

        /**
         * CONFIGURANDO TEMPLATE DE VIEW:
         */
        this.transporter.use(
            'compile',
            nodemailerhbs({
                viewEngine: exphbs.create({
                    layoutsDir: resolve(viewPath, 'layouts'),
                    partialsDir: resolve(viewPath, 'partials'),
                    defaultLayout: 'default',
                    extname: '.hbs',
                }),
                viewPath,
                extName: '.hbs'
            })
        )
    }


    /**
     * sendMail é a função responsa por disparar. nela vou concat. o destinatário + corpoMsg
     */
    sendMail(message) {
    return this.transporter.sendMail({
      ...mailConfig.default,
      ...message,
    });
  }
}

export default new Mail()