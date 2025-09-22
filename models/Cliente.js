class Cliente {
  constructor(nombre, telefono, direccion) {
    this.nombre = nombre;
    this.telefono = telefono;
    this.direccion = direccion;
    this.fechaRegistro = new Date();
  }
}

module.exports = Cliente;