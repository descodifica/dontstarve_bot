const objectMap = require('object.map')

// Classe de dicionário
class Dictionary {
  constructor () {
    // Adiciona à globais
    global.Dictionary = this

    // As sessões do dicionário
    this.sessions = {}

    // Os formatos de datas/horas
    this.formatDates = {}

    // Importa sessões
    require('./de')
    require('./en')
    require('./es')
    require('./fr')
    require('./it')
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
   * @description Adiciona formato de data para um idioma
   * @param {String} _lang O idioma
   * @param {Object} _format O formato
   */
  dateFormat (_lang, _locale) {
    this.formatDates[_lang] = _locale
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

  /**
   * @description Recupera nome dos parâmetros de um método
   * @param {String} _lang O idioma
   * @param {String} _module O módulo do método
   * @param {String} _method O método passado pelo usuário
   * @param {Array} _params Lista com todos os parâmetros
   * @returns {Array} A lista de parâmetros com nome real
   */
  getMethodParams (_lang, _module, _method, _params) {
    // Recebe parâmetros da sessão do dicionário
    const dictionaryParams = this.sessions[_lang][_module].methods[_method].params

    // Compara parâmetros informados com os traduzidos do dicioário
    // Se forem iguais, retorna igual do dicionário
    // Se não, retorna o informado
    return _params.map(param => {
      objectMap(dictionaryParams, (translate, real) => {
        if (translate === param) {
          param = real
        }
      })

      return param
    })
  }

  /**
   * @description Formata uma data para o inglês
   * @param {String} _lang O idioma
   * @param {String} _date A data em padrão do uduina
   * @returns {String} A no formato do idioma
   */
  dateToEn (_lang, _date) {
    // Formato da data no idioma
    const format = this.formatDates[_lang]

    // Separa a data pelo separador
    const translateDate = _date.split(format.sep)

    // Une no formato americano
    return [
      translateDate[format.year], translateDate[format.month], translateDate[format.day],
    ].join('-')
  }
}

module.exports = new Dictionary()