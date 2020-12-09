// Model para editar/criar/deletar usuários
//[para ele funfar, precisa ser carregado pelo loader - está em /src/database/index.js]

import { Model, Sequelize } from 'sequelize'

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        )
    }
}