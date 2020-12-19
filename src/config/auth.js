// aqui armazeno o secret que da acesso ao nosso app

export default {
    secret: process.env.APP_SECRET,
    expiresIn: '7d'
}