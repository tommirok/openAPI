const Sequelize = require('sequelize');
const sequelize = new Sequelize('tasks', '', '', {
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  storage: "db/database.sqlite"
});

module.exports = {
	DataTypes: Sequelize,
	sequelize: sequelize
}

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
