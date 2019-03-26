module.exports = (app, db) => {
  app.get("/tasks", (req, res) => {
    if (req.query.id) {
      db.Task.findOne({
        where: {
          id: req.query.id
        }
      }).then(result => res.send(JSON.stringify(result, null, 4)));
    } else {
      db.Task.findAll({
        include: [
          {
            all: true
          }
        ]
      })
        .then(result => {
          res.send(JSON.stringify(result, null, 4));
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

  app.get("/task/:id", (req, res) => {
    console.log(req.params.id);
    db.Task.findOne({
      where: {
        id: req.params.id
      }
    }).then(result => res.send(JSON.stringify(result, null, 4)));
  });

  app.post("/task", (req, res) =>
    db.post
      .create({
        title: req.body.title,
        content: req.body.content
      })
      .then(result => res.json(result))
  );

  app.put("/task/:id", (req, res) =>
    db.Task.update(
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        where: {
          id: req.params.id
        }
      }
    ).then(result => res.json(result))
  );

  app.delete("/post/:id", (req, res) =>
    db.post
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(result => res.json(result))
  );
};
