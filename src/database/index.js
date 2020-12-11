//Arquivo responsa por conectar o Model na base

import Sequelize from 'sequelize'

// importando models
import User from '../app/models/User'
import File from '../app/models/File'
import Appointment from '../app/models/Appointment'


// import responsa por trazer parâmetros do database
import databaseConfig from '../config/database'

const models = [User, File, Appointment]

class Database {
    constructor() {
        this.init()
    }


    init() {
        this.connection = new Sequelize(databaseConfig)

        // aqui vamos percorrer todos os models (classes dentro deles)
        models.map(model => model.init(this.connection))

        //abaixo uma condicional maluca: 
        //isso para poder executar (apenas nas classes que contém o método associate - User não tem)
        models.map(model => model.associate && model.associate(this.connection.models))

    }

}

export default new Database()