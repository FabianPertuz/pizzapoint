class Pedido {
  constructor(clienteId, pizzas, total, repartidorId) {
    this.clienteId = clienteId;
    this.pizzas = pizzas; 
    this.total = total;
    this.fecha = new Date();
    this.repartidorId = repartidorId;
    this.estado = 'pendiente';
  }
}

module.exports = Pedido;