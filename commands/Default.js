const objectMap = require('object.map')

// Classe padrão dos comandos
class DefaultCommand {
  constructor ({ methods, resume, } = {}) {
    // Recebe o nome do comando
    this.command = this.constructor.name

    // Mapa de métodos
    this.addMethods(methods || { ptbr: {}, en: {}, })

    // Descrição do comando
    this.resume = resume || 'Descrição não definida'
  }

  /**
   * @description Método padrão
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _message, _config) {
    _message.reply(
      resolveLangMessage(_config.lang, {
        ptbr: 'É necessário passar um método para o comando. Entre com o comando de ajuda para ' +
          'maiores detalhes',
        en: 'It is necessary to pass a method to the command. Enter the help command for ' +
          'more details',
      })
    )
  }

  /**
    * @description Executa o comando
    * @param {String} _command Nome do método
    * @param {Array[String]} _args Array com todos os argumentos
    * @param {Object} _message Objeto da mensagem
    * @param {Object} _config Configurações dobot no servidor
    */
  exec (_method, _args, _message, _config) {
    // Traduz o nome do método de acordo com o idioma dobot
    const method = (this.methods[_config.lang][_method] || {}).name || _method

    // Chama o método passando os parâmetros
    this[method](_args, _message, _config)
  }

  /**
    * @description Retorna o ID do autor da mensagem
    * @param {Object} _message Objeto da mensagem
    * @returns {String} O ID
    */
  authorId (_message) {
    return _message.author.id
  }

  /**
    * @description Retorna o ID do servidor
    * @param {Object} _message Objeto da mensagem
    * @returns {String} O ID
    */
  serverId (_message) {
    return _message.channel.guild.id
  }

  /**
    * @description Retorna o ID do dono do servidor
    * @param {Object} Objeto da mensagem
    * @returns {String} O ID
    */
  serverOwnerID (_message) {
    return _message.guild.ownerID
  }

  /**
    * @description Retorna se o autor da mensagem é dono do servidor
    * @param {Object} _message Objeto da mensagem
    * @returns {Boolean}} Se é dono
    */
  authorOwnerServerID (_message) {
    return this.authorId(_message) === this.serverOwnerID(_message)
  }

  /**
    * @description Retorna se um dado método existe em um dado idioma
    * @param {String} _method Nome do método
    * @param {String} _lang Idioma
    * @returns {Boolean} Se existe
    */
  methodExists (_method, _lang) {
    return _method === 'main' || !!this.methods[_lang][_method]
  }

  /**
    * @description Adiciona métodos ao mapa  de métodos
    * @param {Object} _methods Mapa de métodos
    */
  addMethods (_methods = {}) {
    // Importa verificação de idiomas
    const { checkLangs, } = require('../lang')

    // Verifica idiomas
    checkLangs(_methods)

    // Se não tem ainda um dicionário, apenas adiciona
    if (!this.methods) {
      this.methods = _methods
    }

    // Percorre todos os idiomas e adiciona ao dicionário
    objectMap(_methods, (methods, lang) => {
      this.methods[lang] = { ...(this.methods[lang] || {}), ...methods, }
    })
  }
}

module.exports = DefaultCommand