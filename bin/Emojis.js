const objectMap = require('object.map')

const emojis = {
  number_0: '0️⃣',
  number_1: '1️⃣',
  number_2: '2️⃣',
  number_3: '3️⃣',
  number_4: '4️⃣',
  number_5: '5️⃣',
  number_6: '6️⃣',
  number_7: '7️⃣',
  number_8: '8️⃣',
  number_9: '9️⃣',
  number_10: '🔟',
  next: '⏭️',
  preview: '⏮️',
  inputLatinLetters: '🔤',
  new: '🆕',
  brFlag: '🇧🇷',
  gear: '⚙️',
  dramaMasks: '🎭',
  stream: '🖥️',
  smile: '😃',
  user: '👤',
  users: '👥',
  eye: '👁️',
  death: '☠️',
  island: '🏝️',
  castle: '🏰',
  ghost: '👻',
  magnifyingGlass: '🔎',
  pencil: '✏️',
  ticket: '🎟️',
  label: '🏷️',
  genre: '🚻',
  cake: '🎂',
  city: '🏙️',
  road: '🛣️',
  country: '🗾',
  new: '🆕',
  cd: '💿',
  joystick: '🎮',
  clock: '⏰',
  mage: '🧙‍♂️',
  calendarCheck: '🗓️',
  medal: '🏅',
  home: '🏠',
  check: '✅',
  cancel: '❌',
  man: '🧑',
  girl: '👩',
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