const objectMap = require('object.map')

const emojis = {
  inputLatinLetters: '🔤',
  raisedRand: '✋',
  brFlag: '🇧🇷',
}

/**
 * @description Gerencia os Emojis
 */
class Emojis {
  // Adiciona nas globais
  constructor () {
    global.Emojis = this
  }

  /**
   * @description Troca todas as chaves de um JSON por emojis
   * @param {Object} _json O JSON
   * @returns {Object} JSON com chaves trocadas
   */
  exchangeKeys (_json) {
    // A retornar
    const json = {}

    // Troca
    objectMap(_json, (val, emojiName) => {
      json[this.get(emojiName)] = val
    })

    // Retorna
    return json
  }

  /**
   * @description Troca todos os valores de um JSON por emojis
   * @param {Object} _json O JSON
   * @returns {Object} JSON com valores trocados
   */
  exchangeValues (_json) {
    // A retornar
    const json = {}

    // Troca
    objectMap(_json, (emojiName, key) => {
      json[key] = this.get(emojiName)
    })

    // Retorna
    return json
  }

  /**
   * @description Retorna um emoji dado um nome
   * @param {String} _name O nome do emoji
   * @returns {String} O Emoji
   */
  get (_name) {
    return emojis[_name]
  }

  /**
   * @description Retorna o id de um emoji
   * @param {String} _emoji O Emoji
   * @returns {String} O Id do emoji
   */
  getId (_emoji) {
    let id

    objectMap(emojis, (emoji, name) => {
      if (emoji, _emoji === emoji) {
        id = name
      }
    })

    return id
  }
}

module.exports = new Emojis()