// Classe padrão dos comandos
class DefaultCommand {
  constructor (_params = {}) {
    // Recebe o nome do comando
    this.command = this.constructor.name.toLowerCase()

    // Recebe opções
    this.options = _params.options || []
  }
}

module.exports = DefaultCommand