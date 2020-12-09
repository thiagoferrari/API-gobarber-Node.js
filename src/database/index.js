//Arquivo responsa por conectar o Model na base

import Sequelize from 'sequelize'

// importando model de users:
import User from '../app/models/User'

// import responsa por trazer parâmetros do database
import databaseConfig from '../config/database'

const models = [User]

class Database {
    constructor() {
        this.init()
    }


    init() {
        this.connection = new Sequelize(databaseConfig)

        // aqui vamos percorrer todos os models (classes dentro deles)
        models.map(model => model.init(this.connection))
    }

}

export default new Database()