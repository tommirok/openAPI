module.exports = (app, db) => {
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
  app.get("/user/:id", (req, res) =>
    db.UserTask.findAll().then(result => res.json(result))
  );
  app.get("/user/task", (req, res) =>
    db.UserTask.findAll(req.params.id).then(result => res.json(result))
  );
};
