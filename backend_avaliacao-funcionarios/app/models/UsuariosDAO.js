const ObjectId = require("mongodb").ObjectId;
const _connection = require("../../config/dbConn");
var crypto = require("crypto");
function UsuariosDAO() {}

UsuariosDAO.prototype.getUsuarios = function (req, res) {
  function f(err, db) {
    db.collection("Usuarios")
      .find()
      .toArray()
      .then((result) => {
        res.status(200).json({ users: result });
      });
  }
  _connection(f);
};
UsuariosDAO.prototype.cadastrarUser = function (req, res) {
  let user = req.body;

  function f(err, db) {
    db.collection("Usuarios")
      .findOne({ email: user.email })
      .then((result) => {
        if (result) {
          res.json({ msg: "ja cadastrado" });
        } else {
          let senhacript = crypto
            .createHash("md5")
            .update(user.senha)
            .digest("hex");
          user.senha = senhacript;
          db.collection("Usuarios")
            .insert(user)
            .then((result) => {
              res.json(result);
            });
        }
      });
  }
  _connection(f);
};

UsuariosDAO.prototype.atualizarUser = function (req, res) {
  let _idUser = req.params.id;
  let user = req.body;
  let senhacript = crypto.createHash("md5").update(user.senha).digest("hex");
  user.senha = senhacript;
  function f(err, db) {
    db.collection("Usuarios")
      .updateOne(
        {
          _id: ObjectId(_idUser),
        },
        {
          $set: {
            nome: user.nome,
            email: user.email,
            senha: user.senha,
            perfil: user.perfil,
          },
        }
      )
      .then((result) => {
        res.json(result);
      });
  }
  _connection(f);
};

UsuariosDAO.prototype.deletarUser = function (req, res) {
  let _idUser = req.params.id;

  function f(err, db) {
    db.collection("Usuarios")
      .deleteOne({
        _id: ObjectId(_idUser),
      })
      .then((result) => {
        res.json(result);
      });
  }
  _connection(f);
};
UsuariosDAO.prototype.autenticarUser = function (req, res) {
  let _user = req.body;
  let senhacript = crypto.createHash("md5").update(_user.senha).digest("hex");
  _user.senha = senhacript;
  function f(err, db) {
    db.collection("Usuarios")
      .findOne({ email: _user.email, senha: _user.senha })
      .then((result) => {
        if (result) {
          if (result) {
            _user = result;
            res.json({ user: _user });
          } else {
            res.json({ msg: "Usuário ou senha incorretos!" });
          }
        }
      });
  }
  _connection(f);
};

module.exports = () => UsuariosDAO;
