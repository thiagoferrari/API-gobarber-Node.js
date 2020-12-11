/* migration/model para agendamentos:
  toda vez que um usuário marcar um agendamento com algum prestador,
      será criado um agendamento nessa table:
*/

import { Model, Sequelize } from 'sequelize'

class Appointment extends Model {
    static init(sequelize) {
        super.init(
            {
                date: Sequelize.DATE,
                canceled_at: Sequelize.STRING,
            },
            {
                sequelize,
            }
        )
        return this
    }

    /* FAZENDO RELACIONAMENTOS: */
    static associate(models) {
        this.belongsTo(models.User, {foreignKey: 'user_id', as: 'user'})
        this.belongsTo(models.User, {foreignKey: 'provider_id', as: 'provider'})
    }
}


export default Appointment