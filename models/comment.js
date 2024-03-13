const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
  static initiate(sequelize) {
    Comment.init({
      content: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',  /* 이모지  */
      collate: 'utf8mb4_general_ci', 
    });
  }
  
  static associate(db) {
    db.Comment.belongsTo(db.User, {foreignKey: 'UserId', targetKey: 'id'});  
    db.Comment.belongsToMany(db.Post, { through: 'PostComment', onDelete: 'CASCADE' });
  }
}

module.exports = Comment;