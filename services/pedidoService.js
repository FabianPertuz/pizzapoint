const database = require('../config/database');
const Pedido = require('../models/Pedido');

class PedidoService {
  async realizarPedido(clienteId, pizzaIds) {
    const session = database.client.startSession();
    
    try {
      await session.withTransaction(async () => {
        const pedidosCollection = database.getCollection('pedidos');
        const ingredientesCollection = database.getCollection('ingredientes');
        const pizzasCollection = database.getCollection('pizzas');
        const repartidoresCollection = database.getCollection('repartidores');

       
        let total = 0;
        const pizzasDetalles = [];
        
        for (const pizzaId of pizzaIds) {
          const pizza = await pizzasCollection.findOne({ _id: pizzaId });
          if (!pizza) throw new Error(`Pizza ${pizzaId} no encontrada`);
          
          total += pizza.precio;
          pizzasDetalles.push({ pizzaId, precio: pizza.precio });

         
          for (const ingred of pizza.ingredientes) {
            const ingrediente = await ingredientesCollection.findOne({ _id: ingred.ingredienteId });
            if (!ingrediente || ingrediente.stock < ingred.cantidad) {
              throw new Error(`Stock insuficiente para ${ingrediente?.nombre}`);
            }
          }
        }

        for (const pizzaId of pizzaIds) {
          const pizza = await pizzasCollection.findOne({ _id: pizzaId });
          for (const ingred of pizza.ingredientes) {
            await ingredientesCollection.updateOne(
              { _id: ingred.ingredienteId },
              { $inc: { stock: -ingred.cantidad } },
              { session }
            );
          }
        }


        const repartidor = await repartidoresCollection.findOneAndUpdate(
          { estado: 'disponible' },
          { $set: { estado: 'ocupado' } },
          { session, returnDocument: 'after' }
        );

        if (!repartidor) throw new Error('No hay repartidores disponibles');


        const nuevoPedido = new Pedido(
          clienteId,
          pizzasDetalles,
          total,
          repartidor._id
        );

        await pedidosCollection.insertOne(nuevoPedido, { session });
        
        console.log('✅ Pedido realizado exitosamente');
        console.log(`📦 Total: $${total}`);
        console.log(`🛵 Repartidor asignado: ${repartidor.nombre}`);
      });
    } catch (error) {
      console.error('❌ Error en el pedido:', error.message);
      throw error;
    } finally {
      await session.endSession();
    }
  }
}

module.exports = new PedidoService();