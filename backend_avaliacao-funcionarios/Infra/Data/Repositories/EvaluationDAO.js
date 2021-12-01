const ObjectId = require("mongodb").ObjectId;
const _connection = require("../../../Shared/DbConnectionMongoDb");
const dbConn = require("../../../Shared/DbConnectionMySQL");
const uuid = require("uuid");
var crypto = require("crypto");