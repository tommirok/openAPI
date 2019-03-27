const { check, validationResult, param } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
module.exports = (app, db) => {
  app.get("/tasks", (req, res) => {
    if (req.query.id) {
      db.Task.findOne({
        where: {
          id: req.query.id
        }
      }).then(result => res.send(JSON.stringify(result, null, 4)));
    } else {
      db.Task.findAll()
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
      },
      include: [
        {
          all: true
        }
      ]
    }).then(result => res.send(JSON.stringify(result, null, 4)));
  });

  app.post(
    "/task",
    [
      check("title").exists(),
      check("topic").exists(),
      check("briefing").exists(),
      check("location").exists(),
      check("deadLine")
        .isISO8601()
        .withMessage("deadline must be numeric ex 01-01-2020 ")
    ],
    (req, res) => {
      const { title, topic, briefing, location, deadLine } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      db.Task.findAll({
        where: {
          title: title
        }
      }).then(result => {
        if (result.length === 0) {
          db.Task.create({
            title: title,
            topic: topic,
            briefing: briefing,
            location: location,
            deadLine: deadLine,
            done: false
          }).then(result => {
            const results = [result];
            results.push("task was created");
            res.status(200).send(JSON.stringify(results, null, 4));
          });
        } else {
          result.push("task title already exists");
          res.status(422).send(JSON.stringify(result, null, 4));
        }
      });
    }
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
