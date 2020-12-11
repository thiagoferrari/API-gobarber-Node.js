'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', //nome da tabela que quero dar o ALTERTABLE
      'avatar_id', //nome da nova coluna, e seus tipos:
      {
        type: Sequelize.INTEGER,
        // abaixo definindo uma foreign key (model vem de 'tabela modelo/referencia')
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE', // Quando atualiza a imagem, altera no usuário
        onDelete: 'SET NULL', // Quando deletar o avatar deixa o avatar_id como null
        allowNull: true,
      }

    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'avatar_id')
  }
};
