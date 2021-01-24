const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
 
// Retorna todos os PEDIDOS
router.get('/',(req, res, next) => {
   mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(`SELECT  pedidos.id_pedidos,
            pedidos.quantidade,
            produtos.id_produtos,
            produtos.nome,
            produtos.preco
            FROM pedidos
            INNER JOIN produtos
            ON produtos.id_produtos = pedidos.id_produtos;`,
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error}) }   
                const response = {
                    pedidos: result.map(pedido => {
                        return {
                            id_pedidos: pedido.id_pedidos,
                            quantidade: pedido.quantidade,
                                produto: {
                                    id_produtos: pedido.id_produtos,
                                    nome: pedido.nome, // pq esse preco nao aparece
                                    preco: pedido.preco
                                },
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto especifico',
                                url: 'http://localhost:3000/pedidos/'+ pedido.id_pedidos
                            }
                        }
                    })
                }             
                return res.status(200).send(response);
            }
        )
    })
 
});
 


// Insere um PEDIDO
router.post('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error })}
        conn.query('SELECT * FROM produtos WHERE id_produtos =?', 
        [req.body.id_produto],
        (error, result, field) => {
            if(error) { return res.status(500).send({ error: error}) }
            if(result.length == 0) {
                return res.status(404).send({ 
                    mensagem: ' produto nao encontrado'
                })
            }
          conn.query(
            'INSERT INTO pedidos (id_produtos, quantidade) VALUES (?,?)',
            [req.body.id_produto, req.body.quantidade],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: ' Pedido inserido com sucesso',
                    pedidoCriado: {
                        id_pedido: result.id_pedido,
                        id_produto: req.body.id_produto,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                }
                return res.status(201).send(response);
            }
        )
        })
    });
});

// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM pedidos WHERE id_pedidos = ?;',
            [req.params.id_pedido],
            (error, result, fields) => {
                if(error) { return res.status(500).send({ error: error}) }  
                
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Nao foi encontrado pedido com esse Id'
                    })
                }
                const response = {
                    pedido: {
                        id_pedidos: result[0].id_pedidos,
                        id_produtos: result[0].id_produtos,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os pedidos',
                            url: 'http://localhost:3000/pedidos'
                        }
                    }
                    
            }
            return res.status(200).send(response);
        
        })
        
    });

});

//EXCLUI UM PEDIDO
router.delete('/', (req, res, next) => {


    mysql.getConnection((error, conn) => {
        if(error){ return res.status(500).send({ error}) } 
        conn.query(
            `DELETE FROM pedidos 
                WHERE id_pedidos = ?`, [req.body.id_pedido],
            (error, result, field) => {
                conn.release();
                if(error) { return res.status(500).send({ error: error}) }
                const response = {
                    mensagem: 'Pedido removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um Pedido',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            id_produto: 'Number',
                            quantidade: 'Number' 
                        }
                    }
                }
                return res.status(202).send(response);
            }
        )
    });

})


module.exports = router;