/* importar as configurações*/
const build = require("../Shared/Configuration");

/* parametrizar a porta de escuta */
build.listen(3030, () => {
  console.log("Servidor online");
});
