// Classe de dicionário
class Dictionary {
  constructor () {
    // Adiciona à globais
    global.Dictionary = this

    // As sessões do dicionário
    this.sessions = {}

    // Importa sessões
    require('./ptbr')
    // require('./en')
    // require('./de')
    // require('./fr')
    // require('./es')
    // require('./it')
    // require('./zhcn')
  }

  /**
   * @description Retorna os idiomas disponíveis
   * @returns {Array}
   */
  langs () {
    return Object.keys(this.sessions)
  }

  /**
   * @description Adiciona uma sessão do dicionário
   * @param {String} _lang O idioma
   * @param {Object} _session A sessão do dicionário
   */
  add (_lang, _session) {
    this.sessions[_lang] = _session
  }

  /**
   * @description Retorna o nome de um idioma
   * @param {String} _lang O idioma
   * @returns {String}
   */
  getLangName (_lang) {
    return this.sessions[_lang].name
  }

  /**
   * @description Retorna um texto no idioma pedido
   * @param {String} _id ID do texto
   * @param {String} _serverConfig Configurações do servidor
   * @param {Object} _params Parâmetros do texto
   * @param {Object} _format Formatação do texto
   * @returns {String}
   */
  get (_id, _serverConfig, _params = {}, _format = {}) {
    // Identificador e módulo da mensagem
    const [ module, id, ] = _id.split('.')

    // Recebe a mensagem
    let msg = this.sessions[_serverConfig.lang].text[module][id]

    // Se não achou, informa no console
    if (!msg) {
      console.log(_id + ' não encontrado no dicionário ' + _serverConfig.lang)
    }

    // Se  mensagem não for string, executa com parametros e configurações do servidor

    msg = typeof msg === 'string' ? msg : msg(_serverConfig, _params)

    // Formata e retorna
    return this.format(msg, _format)
  }

  /**
   * @description Retorna a bandeira de um idioma
   * @param {String} _lang O idioma
   * @returns {String}
   */
  flag (_lang) {
    return this.sessions[_lang].flag
  }

  /**
   * @description Formata e retorna uma mensagem
   * @param {String} _msg A mensagem
   * @param {Object} _format A formatação
   * @returns {String}
   */
  format (_msg, _format) {
    if (_format.label) {
      _msg = `**${_msg}**: `
    }

    if (_format.bold) {
      _msg = `**${_msg}** `
    }

    if (_format.italic) {
      _msg = `*${_msg}* `
    }

    if (_format.underline) {
      _msg = `__${_msg}__ `
    }

    return _msg
  }

  /**
   * @description Retorna formato de data de um dado idioma
   * @param {String} _lang O idioma
   * @returns {Object}
   */
  getDateFormat (_lang) {
    return this.sessions[_lang].dateFormat
  }
}

module.exports = new Dictionary()