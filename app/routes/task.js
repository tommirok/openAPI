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
  /**
   * jsdoc for swagger
   *
   * @swagger
   * /tasks:
   *   get:
   *     description: get all tasks
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: login
   */
  app.get(
    "/task/:id",
    [
      param("id")
        .isNumeric()
        .withMessage("id parameter must be number")
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      db.Task.findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            all: true
          }
        ]
      }).then(result => {
        if (result) {
          res.status(200).send(JSON.stringify(result, null, 4));
        } else {
          result = "task was not found with this id";
          res.status(404).send(JSON.stringify(result, null, 4));
        }
      });
    }
  );

  app.post(
    "/task",
    [
      check("title").exists(),
      check("topic").exists(),
      check("briefing").exists(),
      check("location").exists(),
      check("deadLine")
        .isISO8601()
        .withMessage("deadline must be as yyyy-mm-dd ")
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

  app.put(
    "/task",
    [
      check("id")
        .exists()
        .isNumeric()
        .withMessage("id parameter must be numeric"),
      check("deadLine")
        .optional()
        .isISO8601()
        .withMessage("date must be as yyyy-mm-dd")
    ],
    (req, res) => {
      const { id, location, deadLine, done } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      db.Task.update(
        {
          location: location,
          deadLine: deadLine,
          done: done
        },
        {
          where: {
            id: id
          }
        }
      ).then(result => {
        if (result[0] === 1) {
          result.push("task was updated");
          res.status(200).send(JSON.stringify(result, null, 4));
        } else {
          result.push("no such taskId found");
          res.status(404).send(JSON.stringify(result, null, 4));
        }
      });
    }
  );

  app.delete(
    "/task/:id",
    [
      param("id")
        .isNumeric()
        .withMessage("id parameter must be number")
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      db.Task.destroy({
        where: {
          id: req.params.id
        }
      }).then(result => {
        if (result) {
          result = "task was deleted";
          res.status(200).send(JSON.stringify(result, null, 4));
        } else {
          result = "no such taskId found";
          res.status(404).send(JSON.stringify(result, null, 4));
        }
      });
    }
  );
};
