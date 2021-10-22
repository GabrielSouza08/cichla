/* importar as configurações do servidor */
const app = require("./4-Shared/server");

/* parametrizar a porta de escuta */
app.listen(3030, () => {
    console.log("Servidor online");
});