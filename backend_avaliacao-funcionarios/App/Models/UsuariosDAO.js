const dbConn = require("../../Shared/DbConnection");
const uuid = require("uuid");
function UsuariosDAO() {}

UsuariosDAO.prototype.consultarUsers = (req, res) => {
  let conn = new dbConn(true);
  let query = `select * from tb_usuarios`;
  conn.query(query).then((result) => {
    console.log(result);
    res.json(result);
  });
};

UsuariosDAO.prototype.inserirUser = async (req, res) => {
  let user = req.body;
  user.id = uuid.v1();

  let conn = new dbConn(true);
  let query = `insert into tb_usuarios  
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
    res.json({ msg: "deu bom" });
  });
};

module.exports = () => {
  return UsuariosDAO;
};
