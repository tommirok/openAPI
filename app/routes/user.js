const { check, validationResult, param } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");
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
    }).then(result => res.status(200).send(JSON.stringify(result, null, 4)));
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
    }).then(result => res.status(200).send(JSON.stringify(result, null, 4)));
  });

  app.get("/user/:id", (req, res) => {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(result => res.status(200).send(JSON.stringify(result, null, 4)));
  });

  app.get(
    "/user/range/:from/:to?",
    [
      param(["from", "to"])
        .isNumeric()
        .withMessage("id parameters must be number")
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { from, to } = req.params;
      db.User.findAll({
        where: {
          id: {
            [Op.between]: [from, to]
          }
        }
      }).then(result => res.status(200).send(JSON.stringify(result, null, 4)));
    }
  );

  app.post(
    "/user",
    [
      //validating body
      check("userName")
        .isEmail()
        .withMessage("username must be valid email")
        .normalizeEmail(),
      sanitizeBody("notifyOnReply").toBoolean()
    ],
    (req, res) => {
      //this catches validation errors and notifies requesting party
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      const { userName } = req.body;

      db.User.findOrCreate({
        where: {
          username: userName
        }
      }).then(result => {
        if (result[1]) {
          //result[1] is true if relation was created, if it was found its false
          result.push("user was created");
          res.status(200).send(JSON.stringify(result, null, 4));
        } else {
          result.push("user already exists");
          res.status(200).send(JSON.stringify(result, null, 4));
        }
      });
    }
  );

  app.post(
    "/userTotask",
    [
      //validating body
      check(["userId", "taskId"])
        .isNumeric()
        .withMessage("id parameters must be number")
    ],
    (req, res) => {
      //this catches validation errors and notifies requesting party
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      //destructing variables from body
      const { userId, taskId } = req.body;
      //query
      db.UserTask.findOrCreate({
        where: {
          UserId: userId,
          TaskId: taskId
        }
      })
        .then(result => {
          if (result[1]) {
            //result[1] is true if relation was created, if it was found its false
            result.push("user and task was linked");
            res.status(200).send(JSON.stringify(result, null, 4));
          } else {
            result.push("already linked");
            res.status(422).send(JSON.stringify(result, null, 4));
          }
        })
        .catch(err => {
          console.log(err);
          //notify requesting party from a server error
          return res.status(500).json({ err: err });
        });
    }
  );
};
