var Database = require("../db/db");
const faker = require("faker");
const times = require("lodash.times");
const random = require("lodash.random");
const mocks = require("./mocks");
const topics = mocks.topics();
const cities = mocks.cities();
const deadlines = mocks.deadlines();
let i = 0
//mock id:s for initializing the Association join table
const mockid = () => {
	let arr = [...Array(200).keys()];
	i++
	console.log(arr[i])
	return arr[i]
}

//DEFINE TABLES >>>>>>>>>>>>>>>>>>>>
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
      validate: {
        unique: true
      }
    },
    TaskId: {
      type: Database.DataTypes.INTEGER,
      unique: false,
      constraints: false
    }
  },
  { tableName: "UserTask" }
);
//DEFINE TABLES END <<<<<<<<<<<<<

//creates relation for User and UserTask
User.belongsToMany(Task, {
  through: {
    model: UserTask,
    unique: false
  },
  foreignKey: "UserId",
  constraints: false
});

//creates relation for Task and UserTask
Task.belongsToMany(User, {
  through: {
    model: UserTask,
    unique: false
  },
  foreignKey: "TaskId",
  constraints: false
});
//Init Users
User.sync({ force: true }).then(() => {
  User.bulkCreate(
    times(100, () => ({
      username: faker.name.firstName()
    }))
  ).catch(err => {
    console.log(err);
  });
});

//Init Tasks
Task.sync({ force: true }).then(() => {
  Task.bulkCreate(
		times(100, () => ({
      title: faker.lorem.word(),
      topic: topics[random(1, 5)],
      briefing: faker.lorem.paragraph(),
      location: cities[random(1, 5)],
      deadLine: deadlines[random(1, 100)],
      done: false
    }))
  );
});

//Syncs Join table and creates some init associations
UserTask.sync({ force: true }).then(() => {
  UserTask.bulkCreate(
    times(50, () => ({
      UserId: mockid(),
      TaskId: mockid() -1 
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
