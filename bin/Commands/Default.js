// Classe padrão dos comandos
class DefaultCommand {
  constructor (_params = {}) {
    // Recebe o nome do comando
    this.command = this.constructor.name.toLowerCase()

    // Recebe Menu
    this.Menu = require('./' + this.constructor.name + '/Menu')(this)
  }
}

module.exports = DefaultCommand