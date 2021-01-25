const express = require('express');
const router = express.Router();
const PedidosController = require('../controllers/pedidos-controller')
// Retorna todos os PEDIDOS 
router.get('/', PedidosController.getPedidos); // lógica é separada para outro arquivo pra facilitar manutencao e visualizacao
// Insere um PEDIDO
router.post('/', PedidosController.postPedidos); // tudo que está no arquivvo postPedidos - "Poderia vir pra cá se remover o exports =""
// RETORNA OS DADOS DE UM PEDIDO
router.get('/:id_pedido', PedidosController.getUmPedido);
//EXCLUI UM PEDIDO
router.delete('/', PedidosController.deletePedido);


module.exports = router;