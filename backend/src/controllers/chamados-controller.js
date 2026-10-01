const pool = require("../database/database");

async function listarChamados(req, res) {
    try {
        const resultado = await pool.query(
            "SELECT * FROM chamados ORDER BY id"
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar chamados"
        });
    }
}

async function criarChamado(req, res) {
    try {
        const { titulo, descricao, status } = req.body;

        const resultado = await pool.query(
            `INSERT INTO chamados (titulo, descricao, status)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [titulo, descricao, status]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao criar chamado"
        });
    }
}

async function buscarChamado(req, res) {
    try {
        const id = req.params.id;

        const resultado = await pool.query(
            "SELECT * FROM chamados WHERE id = $1",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Chamado não encontrado"
            });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar chamado"
        });
    }
}

async function atualizarChamado(req, res) {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const resultado = await pool.query(
            `UPDATE chamados
             SET status = $1
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Chamado não encontrado"
            });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao atualizar chamado"
        });
    }
}

async function excluirChamado(req, res) {
    try {
        const id = req.params.id;

        const resultado = await pool.query(
            "DELETE FROM chamados WHERE id = $1 RETURNING *",
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                erro: "Chamado não encontrado"
            });
        }

        res.json({
            mensagem: "Chamado excluído com sucesso"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao excluir chamado"
        });
    }
}

module.exports = {
    listarChamados,
    criarChamado,
    buscarChamado,
    atualizarChamado,
    excluirChamado
};