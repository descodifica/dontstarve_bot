// Classe padrão dos comandos
class DefaultCommand {
  constructor (_params = {}) {
    // Recebe o nome do comando
    this.command = this.constructor.name.toLowerCase()

    // Recebe documentação
    this.doc = require('./' + this.constructor.name + '/doc')
  }

  /**
   * @description Método padrão
   * @param {Array} _args Os argumentos passados
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _Message, _config) {
    _Message.sendFromDictionary('general', 'COMMAND_METHOD_REQUIRED')
  }

  /**
    * @description Executa o comando
    * @param {Object} _Message Objeto da mensagem
    */
  exec (_Message) {
    // Chama o método passando os parâmetros
    this[_Message.realMethod](_Message, _Message.serverConfig)
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
   * @description Retorna os parâmetros formatados
   * @param {String} _command O comando real usado
   * @param {String} _method O método real usado
   * @param {String} _params Os parâmetros
   * @param {String} _sub Chave de sub-valores
   * @returns {Object} Os parâmetros formatados
   */
  params (_command, _method, _params, _lang, _sub) {
    // Onde ficarão os parâmetros formatados
    const params = { set: {}, invalid: [], }

    // Une primeira (propriedade) e segunda (valor) posições
    for (let c = 0, max = _params.length; c < max; c += 2) {
      // Nome da propriedade
      const prop = _params[c]

      // Se é compativel com o sub
      if ((!_sub && prop.split('.').length <= 1) || prop.indexOf(_sub) > -1) {
        // Valor formatado da prorpiedade
        const val = _params[c + 1]

        // Propriedade real
        const realProp = Dictionary.getMethodParam(
          _lang, _command, _method, prop.split('.')[1] || prop.split('.')[0]
        )

        // Se achou propriedade real
        if (realProp) {
          // Adiciona valor
          params.set[realProp] = val
        }
        else {
          // Adiciona nome pedido na lista de invalidos
          params.invalid.push(prop)
        }
      }
    }

    return params
  }
}

module.exports = DefaultCommand