/**
 * ARQUIVO DE AUTH/CONFIG. DE EMAIL ALGUNS SERVIÇOS DE E-MAIL:
 * Amazon SES
 * Mailgun
 * Sparkpost
 * Mandril (só para quem usa o Mailcrimp)
 * Gmail
 * 
 * Mailtrap (SOMENTE PARA DEV)
 */

export default {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: "5450c9ee3597e0",
        pass: "27c8004179f21d"
    },
    default: { // abaixo eu defino e remente padrão das msg.
        from: 'Equipe goBarber <noreply@gobarber.com>'
    }
}