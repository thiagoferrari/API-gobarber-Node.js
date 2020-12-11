// Model para editar/criar/deletar usuários
//[para ele funfar, precisa ser carregado pelo loader - está em /src/database/index.js]

import { Model, Sequelize } from 'sequelize'

//importando bcrypt para usar na senha
import bcrypt from 'bcryptjs'


class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,

                // aqui esse Sequelize.VIRTUAL não é uma coluna no banco, somente é usado para comparar o hash de senha.
                password: Sequelize.VIRTUAL,

                password_hash: Sequelize.STRING,
                provider: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        )

        /* esses hooks rastreiam tudo o que acontece no model (semelhante a trigger): */
        // aqui no beforeSave, vamos fazer isso antes de salvar no banco o dado:
        this.addHook('beforeSave', async (user) => {

            // se user.password for informado (para criar/editar usuário) então faça isso:
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8)
            }
        })
        return this
    }

    /*depois de ter associado na nova migration a nova coluna
                                        vamos associar os models*/
    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' })
    } /*                                                  esse as: 'avatar' faz com que o
                                                include do ProviderController retorne um nome customizado */

    // o compare() retorna false para senhas diferentes, true para certo..
    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash)
    }
}


export default User