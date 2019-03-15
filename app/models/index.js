var Database = require("../db/connect")

var Message = Database.sequelize.define("Message", {
	id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	title: Database.DataTypes.STRING,
	content: Database.DataTypes.TEXT,
	userName: Database.DataTypes.STRING,
}, { tableName: "Messages" })

var Reply = Database.sequelize.define("Reply", {
	id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	content: Database.DataTypes.TEXT
}, { tableName: "Replies" })

var Topic = Database.sequelize.define("Topic", {
	id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	name: Database.DataTypes.STRING,
	description: Database.DataTypes.TEXT,

},
	{ tableName: "Topics" })

var User = Database.sequelize.define("User", {
	id: { type: Database.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
	username: Database.DataTypes.STRING,
	password: Database.DataTypes.STRING,
}, {
		tableName: "Users"
	})

Message.belongsTo(User)
User.hasMany(Message)

Message.belongsTo(Topic)
Topic.hasMany(Message)


Reply.belongsTo(Message)
Message.hasMany(Reply)

Reply.belongsTo(User)
User.hasMany(Reply)


User.sync({ force: true }).then(() => {
	// Table created
	return User.create({
		username: "testi",
		password: "sala"
	})
})
Topic.sync({ force: true }).then(() => {
	return Topic.create({
		name: "testi",
		description: "this topic is only for testing purposes"
	})
})
Message.sync({ force: true }).then(() => {
	return Message.create({
		title: "test message",
		content: "this is test message",
		userName: "testi"
	})
})
Reply.sync({ force: true }).then(() => {
	return Reply.create({
		content: "this reply",
	})
})

module.exports = {
	Message: Message,
	Reply: Reply,
	Topic: Topic,
	User: User
}