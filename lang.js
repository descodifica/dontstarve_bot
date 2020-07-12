// Importa idiomas disponíveis no bot
const { langs, } = require('./config')

/**
 * @description Resolve uma mensagem em seu idioma correto
 * @param {String} _lang O idioma desejado
 * @param {Object} _msgs Mensagens em todos os idiomas
 * @returns {String} A mensagem no idioma solicitado
 */
function resolveLangMessage (_lang, _msgs = {}) {
  checkLangs(_msgs)

  return _msgs[_lang]
}

/**
 * @description Verifica se tem idioma faltando
 * @param {Object} _msgs Mensagens em todos os idiomas
 */
function checkLangs (_msgs = {}) {
  langs.map(l => {
    if (_msgs[l]) return

    console.log('Faltando idioma ' + l)
    console.log(_msgs)
  })
}

module.exports = { langs, resolveLangMessage, checkLangs, }