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

var UserTask = Database.sequelize.define(
  "UserTask",
  {
    UserId: {
      type: Database.DataTypes.INTEGER,
			unique: false,
			constraints: false

    },
    TaskId: {
      type: Database.DataTypes.INTEGER,
			unique: false,
			constraints: false

		},
  },
  // No attributes required, just the userId and todoId
  // You could add something else here like a favorites boolean field so a user
  //   can mark a todo as "favorited".

  { tableName: "UserTask" }
);

User.hasMany(Task);
User.belongsToMany(Task, {
  through: {
    model: "UserTask",
    unique: false
  },
  constraints: false
});
Task.hasMany(User);
Task.belongsToMany(User, {
  through: {
    model: "UserTask",
    unique: false
  },
  constraints: false
});

User.sync({ force: true }).then(() => {
  User.bulkCreate(
    times(10, () => ({
      username: faker.name.firstName()
    }))
  ).catch(err => {
    console.log(err);
  });
});
Task.sync({ force: true }).then(() => {
  Task.bulkCreate(
    times(10, () => ({
      title: faker.lorem.sentence(),
      topic: "software",
      briefing: "testing must be done to these test devices by these means",
      location: "Helsinki",
      deadLine: "",
      done: false
    }))
  );
});
UserTask.sync({ force: true }).then(() => {
  UserTask.bulkCreate(
    times(10, () => ({
      UserId: random(1, 10),
      TaskId: random(1, 10)
    }))
  ).catch(err => {
    console.log(err);
  });
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
