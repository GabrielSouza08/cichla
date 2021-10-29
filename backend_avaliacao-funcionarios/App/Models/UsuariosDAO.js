const dbConn = require("../../Shared/DbConnection");
const uuid = require("uuid");
function UsuariosDAO() {}

UsuariosDAO.prototype.consultarUsers = (req, res) => {
  let conn = new dbConn(true);
  let query = `select 
                      user.id_usuario,
                      user.nome,
                      user.email,
                      user.senha,
                      user.perfil,
                      user.id_avaliador,
                      user.id_cargo,
                      user.id_area,
                      user.id_departamento,
                      user.dt_cadastro as user_dt_cadastro,
                      user.dt_alteracao as user_dt_alteracao,
                      user.id_status as user_id_status,
                      cargo.ds_cargo,
                      dpt.ds_departamento,
                      status.ds_status,
                      area.ds_area
                from          tb_usuarios as user
                  inner join tb_cargos as cargo
                    on user.id_cargo = cargo.id_cargo
                  inner join tb_departamentos as dpt
                    on user.id_departamento = dpt.id_departamento
                  inner join tb_status as status
                    on user.id_status = status.id_status
                  inner join tb_areas as area
                    on user.id_area = area.id_area;`;
  conn.query(query).then((result) => {
    res.json({
      status: true,
      data: result,
      msg: [],
    });
  });
};
UsuariosDAO.prototype.desativarUser = (req, res) => {
  let conn = new dbConn(true);
  let query = `update usuarios set status = 2 where id = '${req.params.id}'`;
  conn.query(query).then((result) => {
    res.json({
      status: true,
      data: [],
      msg: [{ texto: "Desativado com sucesso!" }],
    });
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
      res.json({
        status: false,
        data: [],
        msg: [{ texto: "Email ou senha incorretos!" }],
      });
    }
  });
};

UsuariosDAO.prototype.atualizarUser = (req, res) => {
  let user = req.body;
  user.id = req.params.id;

  let query = `select * from tb_usuarios where email = '${user.email}'`;
  let conn = new dbConn(true);
  conn.query(query).then((result) => {
    if (result.length == 0) {
      query = `update tb_usuarios set
              senha = '${user.senha}',
              email = '${user.email}',
              perfil = '${user.perfil}',
              id_avaliador = ${user.id_avaliador},
              id_cargo = ${user.id_cargo},
              id_area = ${user.id_area},
              id_departamento = ${user.id_departamento},
              dt_alteracao = curtime()
              
              where id_usuario = '${user.id}'
              `;

      conn.query(query).then((result) => {
        res.json({
          status: true,
          data: [],
          msg: [{ texto: "Alterado com sucesso!" }],
        });
      });
    } else {
      res.json({
        status: false,
        data: [],
        msg: "Já existe um usuario com este email! Verifique se está desativado.",
      });
    }
  });
};

UsuariosDAO.prototype.inserirUser = (req, res) => {
  let user = req.body;
  user.id = uuid.v1();

  let conn = new dbConn(true);
  let query = `select * from tb_usuarios where email = '${user.email}'`;
  conn.query(query).then((result) => {
    if (result.lengh == 0) {
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
      1
      )
      
      `;
      conn.query(query).then((result) => {
        res.json({
          status: true,
          data: [],
          msg: [{ texto: "Cadastrado com sucesso!" }],
        });
      });
    } else {
      res.json({
        status: false,
        data: [],
        msg: [{ text: "Usuario ja cadastrado! Verifique se está desativado." }],
      });
    }
  });
};
UsuariosDAO.prototype.ativarUser = (req, res) => {
  let idUser = req.params.id;
  let query = `update tb_usuarios set id_status = 1 where id_usuario = '${idUser}'`;
  let conn = new dbConn(true);
  conn.query(query).then((result) => {
    res.json({
      status: true,
      data: [],
      msg: [{ texto: "Ativado com sucesso!" }],
    });
  });
};
module.exports = () => {
  return UsuariosDAO;
};
