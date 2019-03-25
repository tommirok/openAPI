var Database = require("../db/db");
const faker = require("faker");
const times = require("lodash.times");
const random = require("lodash.random");

var Task = Database.sequelize.define(
  "Task",
  {
    id: {
      type: Database.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: Database.DataTypes.STRING,
    topic: Database.DataTypes.STRING,
    briefing: Database.DataTypes.TEXT,
    location: Database.DataTypes.STRING,
    deadLine: Database.DataTypes.STRING,
    done: Database.DataTypes.BOOLEAN
  },
  { tableName: "Task" }
);
Task.associate = () => {
  Task.belongsToMany(User, {
    through: "UserTask"
  });
};
var User = Database.sequelize.define(
  "User",
  {
    id: {
      type: Database.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      allowNull: false,
      type: Database.DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    }
  },

  { tableName: "User" }
);
User.associate = () => {
  User.belongsToMany(Task, {
    through: "UserTask"
  });
};
var UserTask = Database.sequelize.define(
  "UserTask",
  // No attributes required, just the userId and todoId
  // You could add something else here like a favorites boolean field so a user
  //   can mark a todo as "favorited".
  { role: Database.DataTypes.STRING },
  { tableName: "UserTask" }
);

UserTask.associate = models => {
  UserTask.belongsTo(models.Products);
  UserTask.belongsTo(models.Invoices);
};
/* User.belongsToMany(Task, {
  through: UserTask,
  foreignKey: "UserId"
});
Task.belongsToMany(User, {
  through: UserTask,
  foreignKey: "TaskId"
});
 */
User.hasMany(Task);
Task.hasMany(User);
User.sync({ force: true }).then(() => {
  User.bulkCreate(
    times(10, () => ({
      username: faker.name.firstName()
    }))
  );
});

Task.sync({ force: true }).then(() => {
  Task.bulkCreate(
    times(10, () => ({
      title: faker.lorem.sentence(),
      topic: "software",
      briefing: "testing must be done to these test devices by these means",
      location: "Helsinki",
      deadLine: "",
      done: false,
    }))
  );
});

module.exports = {
  Task: Task,
  User: User,
  UserTask: UserTask
};
/* return Task.create({
	title: "do testing",
	topic: "software",
	briefing: "testing must be done to these test devices by these means",
	location: "Helsinki",
	startDate: "16/3/1991",
	deadLine: "",
	done: false,
	UserId: random(1, 10)
}); */
