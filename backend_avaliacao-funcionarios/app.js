/* importar as configurações do servidor */
const app = require("./config/server");

/* parametrizar a porta de escuta */
app.listen(3030, () => {
  console.log("Servidor online");
});
