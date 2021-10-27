const dbConn = require("../../Shared/DbConnection");
const uuid = require("uuid");
function UsuariosDAO() {}

UsuariosDAO.prototype.consultarUsers = (req, res) => {
  let conn = new dbConn(true);
  let query = `select * from tb_usuarios`;
  conn.query(query).then((result) => {
    res.json(result);
  });
};
UsuariosDAO.prototype.desativarUser = (req, res) => {
  let conn = new dbConn(true);
  let query = `update usuarios set status = 2 where id = '${req.params.id}'`;
  conn.query(query).then((result) => {
    res.json(result);
  });
};

UsuariosDAO.prototype.autenticarUser = (req, res) => {
  let user = req.body;
  let conn = new dbConn(true);

  let query = `select * from tb_usuarios where email = '${user.email}'
              and senha = '${user.senha}';
              `;

  conn.query(query).then((result) => {
    if (!result.length == 0) {
      res.json(result);
    } else {
      res.json({ msg: "Email ou senha incorretos!" });
    }
  });
};

UsuariosDAO.prototype.atualizarUser = (req, res) => {
  let user = req.body;
  user.id = req.params.id;

  let conn = new dbConn(true);
  let query = `update tb_usuarios set
              senha = '${user.senha}',
              email = '${user.email}',
              perfil = '${user.perfil}',
              id_avaliador = ${user.id_avaliador},
              id_cargo = ${user.id_cargo},
              id_area = ${user.id_area},
              id_departamento = ${user.id_departamento},
              dt_alteracao = curtime(),
              id_status = ${user.id_status}
              where id_usuario = '${user.id}'
              `;

  conn.query(query).then((result) => {
    console.log(result);
    res.json(result);
  });
};

UsuariosDAO.prototype.inserirUser = async (req, res) => {
  let user = req.body;
  user.id = uuid.v1();

  let conn = new dbConn(true);
  let query = `select * from tb_usuarios where email = '${user.email}'`;
  conn.query(query).then((result) => {
    if (!result.lengh == 0) {
      query = `insert into tb_usuarios  
      (
      id_usuario,
      nome,
      email,
      senha,
      perfil,
      id_avaliador,
      id_cargo,
      id_area,
      id_departamento,
      dt_cadastro,
      dt_alteracao,
      id_status
      )
      values (
      '${user.id}',
      '${user.nome}',
      '${user.email}',
      '${user.senha}',
      '${user.perfil}',
      '${user.id_avaliador}',
      '${user.id_cargo}',
      '${user.id_area}',
      '${user.id_departamento}',
      curtime(),
      curtime(),
      '${user.id_status}'
      )
      
      `;
      conn.query(query).then((result) => {
        res.json({ msg: "Cadastrado com sucesso!" });
      });
    } else {
      res.json({ msg: "Usuario ja cadastrado" });
    }
  });
};

module.exports = () => {
  return UsuariosDAO;
};
