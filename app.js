require('dotenv').config();
const inquirer = require('inquirer');
const database = require('./config/database');
const pedidoService = require('./services/pedidoservice');
const reportService = require('./services/reportService');

async function main() {
  await database.connect();
  
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '¿Qué deseas hacer?',
        choices: [
          'Realizar pedido',
          'Ver reportes',
          'Salir'
        ]
      }
    ]);

    if (action === 'Salir') {
      console.log('👋 ¡Hasta pronto!');
      await database.disconnect();
      process.exit(0);
    }

    if (action === 'Realizar pedido') {
      console.log('Funcionalidad de pedido en desarrollo...');
    }

    if (action === 'Ver reportes') {
      const { reportType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'reportType',
          message: 'Selecciona el reporte:',
          choices: [
            'Ingredientes más utilizados',
            'Promedio de precios por categoría',
            'Categoría más vendida'
          ]
        }
      ]);

      try {
        switch (reportType) {
          case 'Ingredientes más utilizados':
            const ingredientes = await reportService.ingredientesMasUtilizados();
            console.log('\n🍅 Ingredientes más utilizados (último mes):');
            ingredientes.forEach((item, index) => {
              console.log(`${index + 1}. ${item.ingredienteInfo.nombre}: ${item.totalUtilizado} unidades`);
            });
            break;

          case 'Promedio de precios por categoría':
            const promedios = await reportService.promedioPreciosPorCategoria();
            console.log('\n💰 Promedio de precios por categoría:');
            promedios.forEach(cat => {
              console.log(`• ${cat._id}: $${cat.promedioPrecio.toFixed(2)} (${cat.cantidadPizzas} pizzas)`);
            });
            break;

          case 'Categoría más vendida':
            const categoria = await reportService.categoriaMasVendida();
            console.log('\n🏆 Categoría más vendida:');
            console.log(`• ${categoria._id}: ${categoria.totalVentas} ventas ($${categoria.totalIngresos})`);
            break;
        }
      } catch (error) {
        console.error('❌ Error generando reporte:', error.message);
      }
    }
  }
}

main().catch(console.error);