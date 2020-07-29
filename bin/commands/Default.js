// Classe padrão dos comandos
class DefaultCommand {
  constructor () {
    // Recebe o nome do comando
    this.command = this.constructor.name.toLowerCase()
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
    * @param {String} _method Nome do método
    * @param {Object} _Message Objeto da mensagem
    */
  exec (_method, _Message) {
    // Chama o método passando os parâmetros
    this[_method](_Message, _Message.serverConfig)
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
   * @param {Array} _params Os parâmetros recebidos
   * @returns {Object} Os parâmetros formatados
   */
  params (_params) {
    // Onde ficarão os parâmetros formatados
    const params = { set: {}, }

    // Função para criar objeto com o valor separado por pontos
    const map = (_prop, _val, _obj = {}) => {
      const props = [ ..._prop, ]
      const prop = props.shift()
      const obj = { ..._obj, }

      obj[prop] = props.length === 0 ? _val : map(props, _val, obj)

      return obj
    }

    // Une primeira (propriedade) e segunda (valor) posições
    for (let c = 0, max = _params.length; c < max; c += 2) {
      // Nome da propriedade separada por ponto
      const prop = _params[c].split('.')

      // Valor formatado da prorpiedade
      const val = _params[c + 1]

      // Adiciona valor
      params.set = { ...params.set, ...map(prop, val), }
    }

    return params
  }
}

module.exports = DefaultCommand