import app from "./src/app/app.js";
import dotenv from "dotenv";

dotenv.config();

const port = +process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Servidor funcionando na porta ${port}`);
});
