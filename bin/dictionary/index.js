const objectMap = require('object.map')

// Classe de dicionário
class Dictionary {
  constructor () {
    // Adiciona à globais
    global.Dictionary = this

    // As sessões do dicionário
    this.sessions = {}

    // Importa sessões
    require('./en')
    require('./es')
    require('./ptbr')
    require('./zhcn')
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
   * @description Recupera uma mensagem
   * @param {String} _lang O idioma
   * @param {String} _module O módulo
   * @param {String} _id O Id da mensagem
   * @param {Object} _params Os parâmetros da mensagem
   * @returns {String} A mensagem
   */
  getMessage (_lang, _module, _id, _params = {}) {
    const message = this.sessions[_lang][_module].messages[_id]

    return typeof message !== 'function' ? message : message(_params)
  }

  /**
   * @description Recupera um resumo do ódulo
   * @param {String} _lang O idioma
   * @param {String} _module O módulo
   * @returns {String} O resumo
   */
  getResume (_lang, _module) {
    return this.sessions[_lang][_module].resume
  }

  /**
   * @description Recupera nome real de um módulo
   * @param {String} _lang O idioma
   * @param {String} _module O módulo passado pelo usuário
   * @returns {String} O nome do módulo
   */
  getModuleName (_lang, _module) {
    let module

    objectMap(this.sessions[_lang], (v, k) => {
      if (v.name === _module) {
        module = k
      }
    })

    return module
  }

  /**
   * @description Recupera nome de um módulo no idioma do servidor
   * @param {String} _lang O idioma
   * @param {String} _module O módulo desejado
   * @returns {String} O nome do módulo
   */
  getTranslateModule (_lang, _module) {
    return this.sessions[_lang][_module].name
  }

  /**
   * @description Recupera informações um módulo de acordo com o idioma do servidor
   * @param {String} _lang O idioma
   * @param {String} _module O módulo desejado
   * @returns {Object} O módulo
   */
  getModuleInfo (_lang, _module) {
    return this.sessions[_lang][this.getModuleName(_lang, _module)]
  }

  /**
   * @description Recupera nome real de um método
   * @param {String} _lang O idioma
   * @param {String} _module O módulo do método
   * @param {String} _method O método passado pelo usuário
   * @returns {String} O nome do método
   */
  getMethodName (_lang, _module, _method) {
    if ([ 'main', 'invalidRedir', ].indexOf(_method) > -1) return _method

    const module = this.sessions[_lang][_module] || {}
    let method

    objectMap(module.methods || {}, (methodData, methodName) => {
      if (_method !== methodData.name) return

      method = methodName
    })

    return method
  }
}

module.exports = new Dictionary()