module.exports = {
  swagger: "2.0",
  info: {
    description: "Open task api",
    version: "1.0.0",
    title: "Task api",
    contact: {
      email: "tommi.rokolampi@hiq.fi"
    }
  },
  host: "localhost:8080",
  basePath: "/",
  tags: [
    {
      name: "task",
      description: "Endpoints regarding tasks"
    },

    {
      name: "user",
      description: "Operations about user"
    }
  ],

  paths: {
    "/task": {
      post: {
        tags: ["task"],
        summary: "Add a new task to the database",
        description: "",
        operationId: "addtask",
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "task object that needs to be added to the database",
            required: true,
            schema: {
              $ref: "#/definitions/Task"
            }
          }
        ],
        responses: {
          "200": {
            description: "task was created"
          },
          "422": {
            description: "Invalid input"
          },
          "423": {
            description: "already exists"
          }
        }
      },
      put: {
        tags: ["task"],
        summary: "Update an existing task",
        description: "",
        operationId: "updatetask",
        consumes: ["application/json", "application/xml"],
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "task object that needs to be added to the store",
            required: true,
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "integer"
                },
                location: {
                  type: "string"
                },
                deadLine: {
                  type: "string"
                },
                done: {
                  type: "boolean"
                }
              },
              example: {
                id: 1,
                done: true,
                location: "Helsinki",
                deadLine: "2020-02-02"
              }
            }
          }
        ],
        responses: {
          "422": {
            description: "Invalid ID supplied"
          },
          "404": {
            description: "task not found"
          }
        }
      }
    },
    "/tasks": {
      get: {
        tags: ["task"],
        summary: "all",
        description: "Returns tasks",
        operationId: "gettaskBy",
        produces: ["application/json"],
        responses: {
          "200": {
            description: "successful operation",
            schema: {
              $ref: "#/definitions/Task"
            }
          },
          "500": {
            description: "Internal server error"
          }
        }
      }
    },
    "/task/{taskId}": {
      get: {
        tags: ["task"],
        summary: "Find task by ID",
        description: "Returns a single task",
        operationId: "gettaskById",
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            name: "taskId",
            in: "path",
            description: "ID of task to return",
            required: true,
            type: "integer"
          }
        ],
        responses: {
          "200": {
            description: "successful operation",
          },
          "400": {
            description: "Invalid ID supplied"
          },
          "404": {
            description: "task was not found with this id"
          }
        }
      },

      delete: {
        tags: ["task"],
        summary: "Deletes a task",
        description: "",
        operationId: "deletetask",
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            name: "taskId",
            in: "path",
            description: "task id to delete",
            required: true,
            type: "integer",
            format: "int64"
          }
        ],
        responses: {
          "200": {
            description: "task deleted"
          },
          "400": {
            description: "Invalid ID supplied"
          },
          "404": {
            description: "task not found"
          }
        }
      }
    },

    "/user": {
      post: {
        tags: ["user"],
        summary: "Create user",
        description: "This can only be done by the logged in user.",
        operationId: "createUser",
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "Created user object",
            required: true,
            schema: {
              $ref: "#/definitions/User"
            }
          }
        ],
        responses: {
          default: {
            description: "successful operation"
          }
        }
      }
    },
    "/userTotask": {
      post: {
        tags: ["user"],
        summary: "Links user to specific task by given user id and task id",
        description: "",
        operationId: "createUsersWithArrayInput",
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            in: "body",
            name: "body",
            description: "List of user object",
            required: true,
            schema: {
              type: "object",
              properties: {
                id: {
                  type: "integer"
                },
                location: {
                  type: "string"
                },
                deadLine: {
                  type: "string"
                },
                done: {
                  type: "boolean"
                }
              },
              example: {
                taskId: 2,
                userId: 1
              }
            }
          }
        ],
        responses: {
          default: {
            description: "successful operation"
          }
        }
      }
    },
    "/user/tasks/{userId}": {
      get: {
        tags: ["user"],
        summary: "Get user by user name and in what tasks user is in",
        description: "",
        operationId: "getUserByName",
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            name: "userId",
            in: "path",
            description:
              "The name that needs to be fetched. Use user1 for testing. ",
            required: true,
            type: "string"
          }
        ],
        responses: {
          "200": {
            description: "successful operation",
            schema: {
              properties: {
                id: {
                  type: "integer",
                  example: 1
                }
              }
            }
          },
          "400": {
            description: "Invalid username supplied"
          },
          "404": {
            description: "User not found"
          }
        }
      },
      
      
    },
    "/user/range/{from}/{to}?": {
      get: {
        tags: ["user"],
        summary: "Get range of user by id from and to",
        description: "",
        operationId: "getUserByName",
        produces: ["application/xml", "application/json"],
        parameters: [
          {
            name: "from",
            in: "path",
            description:
              "id where to start ",
            required: true,
            type: "string"
          },
          {
            name: "to",
            in: "path",
            description:
              "id where to end ",
            required: true,
            type: "string"
          },
        ],
        responses: {
          "200": {
            description: "successful operation",
            schema: {
              properties: {
                id: {
                  type: "integer",
                  example: 1
                }
              }
            }
          },
          "400": {
            description: "Invalid username supplied"
          },
          "404": {
            description: "User not found"
          }
        }
      },
      
      
    }
  },
  securityDefinitions: {
    taskstore_auth: {
      type: "oauth2",
      authorizationUrl: "http://taskstore.swagger.io/oauth/dialog",
      flow: "implicit",
      scopes: {
        "write:tasks": "modify tasks in your account",
        "read:tasks": "read your tasks"
      }
    },
    api_key: {
      type: "apiKey",
      name: "api_key",
      in: "header"
    }
  },
  definitions: {
    User: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          format: "int64",
          example: "101"
        },
        userName: {
          type: "string",
          format: "email"
        }
      },
      xml: {
        name: "User"
      }
    },
    Task: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          format: "int64"
        },
        title: {
          type: "string"
        },
        topic: {
          type: "string",
          example: "doggie"
        },
        briefing: {
          type: "array",
          location: {
            type: "string"
          },
          deadLine: {
            type: "string"
          }
        }
      },
      example: {
        title: "unit tests",
        topic: "software",
        briefing: "write unit tests using jest or similiar library",
        location: "Helsinki",
        deadLine: "2020-02-02"
      },
      xml: {
        name: "Task"
      }
    },
    ApiResponse: {
      type: "object",
      properties: {
        code: {
          type: "integer",
          format: "int32"
        },
        type: {
          type: "string"
        },
        message: {
          type: "string"
        }
      }
    }
  },
  externalDocs: {
    description: "Find out more about Swagger",
    url: "http://swagger.io"
  }
};
