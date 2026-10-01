require("dotenv").config();

console.log(process.env.DATABASE_URL);

const express = require("express");
const cors = require("cors");

const pool = require("./database/database");

const chamadosRoutes = require("./routes/chamados.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API do Sistema de Chamados funcionando!"
    });
});

app.use("/chamados", chamadosRoutes);

pool.query("SELECT NOW()")
    .then(() => {
        console.log("Banco conectado!");
    })
    .catch((error) => {
        console.error("Erro ao conectar no banco:", error);
    });

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});