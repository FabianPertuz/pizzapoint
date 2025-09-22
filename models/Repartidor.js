class Repartidor {
  constructor(nombre, zona) {
    this.nombre = nombre;
    this.zona = zona;
    this.estado = 'disponible';
  }
}

module.exports = Repartidor;