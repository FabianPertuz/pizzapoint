const database = require('../config/database');

class ReportService {
  async ingredientesMasUtilizados() {
    const pedidosCollection = database.getCollection('pedidos');
    const pizzasCollection = database.getCollection('pizzas');
    const ingredientesCollection = database.getCollection('ingredientes');

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const result = await pedidosCollection.aggregate([
      { $match: { fecha: { $gte: lastMonth } } },
      { $unwind: '$pizzas' },
      {
        $lookup: {
          from: 'pizzas',
          localField: 'pizzas.pizzaId',
          foreignField: '_id',
          as: 'pizzaInfo'
        }
      },
      { $unwind: '$pizzaInfo' },
      { $unwind: '$pizzaInfo.ingredientes' },
      {
        $group: {
          _id: '$pizzaInfo.ingredientes.ingredienteId',
          totalUtilizado: { $sum: '$pizzaInfo.ingredientes.cantidad' }
        }
      },
      { $sort: { totalUtilizado: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'ingredientes',
          localField: '_id',
          foreignField: '_id',
          as: 'ingredienteInfo'
        }
      },
      { $unwind: '$ingredienteInfo' }
    ]).toArray();

    return result;
  }

  async promedioPreciosPorCategoria() {
    const pizzasCollection = database.getCollection('pizzas');

    const result = await pizzasCollection.aggregate([
      {
        $group: {
          _id: '$categoria',
          promedioPrecio: { $avg: '$precio' },
          cantidadPizzas: { $sum: 1 }
        }
      },
      { $sort: { promedioPrecio: -1 } }
    ]).toArray();

    return result;
  }

  async categoriaMasVendida() {
    const pedidosCollection = database.getCollection('pedidos');

    const result = await pedidosCollection.aggregate([
      { $unwind: '$pizzas' },
      {
        $lookup: {
          from: 'pizzas',
          localField: 'pizzas.pizzaId',
          foreignField: '_id',
          as: 'pizzaInfo'
        }
      },
      { $unwind: '$pizzaInfo' },
      {
        $group: {
          _id: '$pizzaInfo.categoria',
          totalVentas: { $sum: 1 },
          totalIngresos: { $sum: '$pizzas.precio' }
        }
      },
      { $sort: { totalVentas: -1 } },
      { $limit: 1 }
    ]).toArray();

    return result[0];
  }
}

module.exports = new ReportService();