module.exports = (app, db) => {
  const Op = require("sequelize").Op;
  app.get("/users", (req, res) => {
    res.header("Content-Type", "application/json");
    db.User.findAll({
      include: [
        {
          all: true
        }
      ]
    }).then(result => res.send(JSON.stringify(result, null, 4)));
  });

  app.get("/user/tasks/:id", (req, res) => {
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: [
        {
          all: true
        }
      ]
    }).then(result => res.send(JSON.stringify(result, null, 4)));
  });

  app.get("/user/:id", (req, res) => {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(result => res.send(JSON.stringify(result, null, 4)));
  });

  app.get("/user/range/:from/:to?", (req, res) => {
    const { from, to } = req.params;
    if (from && to) {
      db.User.findAll({
        where: {
          id: {
            [Op.between]: [from, to]
          }
        }
      }).then(result => res.send(JSON.stringify(result, null, 4)));
    } else if (from || to) {
      if (from) {
        db.User.findAll({
          where: {
            id: {
              [Op.gt]: from
            }
          }
        }).then(result => res.send(JSON.stringify(result, null, 4)));
      } else {
      }
    }
  });

  app.post("/user/:userName", (req, res) => {
    const { userName } = req.params;
    if(userName) {
      db.User.findOrCreate({
        where: {
          username: userName
        }
      }).then(res => {
        console.log(res)
      })
    }
  })
};
