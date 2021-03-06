require('dotenv/config') // importando variáveis ambiente

// credenciais para conex. com banco:

// estamos usando o module.exports devido o sequelize usar esse arquivo (sequelize não aguenta o Import from..)
module.exports = {
    dialect: 'postgres', //comecei a usar esse dialeto depois que importei no yarn seu pacote
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    define: {
        timestamps: true, //garante que toda tabela tenha campo de data de criação/mod
        underscored: true, 
        underscoredAll: true,
        // underscored transforma todos nomes das tabelas de camelCase (contaPaciente para conta_paciente)
    },
}