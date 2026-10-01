const express = require("express");

const {
    listarChamados,
    criarChamado,
    buscarChamado,
    atualizarChamado,
    excluirChamado
} = require("../controllers/chamados-controller");

const router = express.Router();

router.get("/", listarChamados);

router.post("/", criarChamado);

router.get("/:id", buscarChamado);

router.patch("/:id", atualizarChamado);

router.delete("/:id", excluirChamado);

module.exports = router;