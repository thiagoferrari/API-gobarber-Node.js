/* migration/model para agendamentos:
  toda vez que um usuário marcar um agendamento com algum prestador,
      será criado um agendamento nessa table:
*/

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      // NO TOTAL VAMOS TER DOIS RELACIONAMENTOS:
      // user_id e provider_id, todos vão se basear no id da table users

      user_id: {
        type: Sequelize.INTEGER,
        // abaixo definindo uma foreign key (model vem de 'tabela modelo/referencia')
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', // Quando atualizar o user em um agenda., todos os seus registros serão alt.
        onDelete: 'SET NULL', // se user deletar acc, o prestador continua a ter no hist. os agenda. o user
        allowNull: true,
      },

      provider_id: {
        type: Sequelize.INTEGER,
        // abaixo definindo uma foreign key (model vem de 'tabela modelo/referencia')
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', // Quando atualizar o prestador em um agenda., todos os seus registros serão alt.
        onDelete: 'SET NULL', // se o prestador deletar acc, o user continua a ter no hist. os agenda. com prestador
        allowNull: true,
      },

      canceled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('appointments')
  }
};