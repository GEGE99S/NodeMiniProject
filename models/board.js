const Sequelize = require('sequelize');

class Board extends Sequelize.Model {
  static initiate(sequelize) {
    Board.init({
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true, // 자동으로 증가하는 id로 설정
      },
      creater: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      subject: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Board',
      tableName: 'board',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
  
};

module.exports = Board;