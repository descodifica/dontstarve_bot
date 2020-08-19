// Menu padrão
const Menu = require('../Menu')

/**
 * @description Menu do comando de configuração
 */
class ConfigMenu extends Menu {
  /**
   * @description Método principal
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_Message, _config) {
    // Opções do menu
    const options = [
      {
        icon: 'inputLatinLetters',
        name: Dictionary.get('config.language', _config),
        value: Dictionary.get('config.language_resume', _config),
      },
    ]

    // Defnições do menu
    const defs = {
      title: Dictionary.get('config.index', _config),
      options,
    }

    // Envia menu e executa comando desejado
    _Message.sendPrompt(defs).then(emoji => {
      switch (emoji._id) {
        case 'inputLatinLetters': this.lang(_Message, _config)
      }
    })
  }

  /**
   * @description Configuração de idioma
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  lang (_Message, _config) {
    // Opções do menu
    const options = [
      {
        icon: 'brFlag',
        name: Dictionary.getLangName('ptbr'),
      },
    ]

    // Definições do menu
    const defs = {
      title: Dictionary.get('config.whatAge', _config),
      options,
    }

    // Onde guardar idioma escolhido
    let lang

    // Envia menu
    _Message.sendPrompt(defs).then(emoji => {
      switch (emoji._id) {
        case 'brFlag': lang = 'ptbr'
          break
      }

      this.module.lang(_Message, _config, lang)
    })
  }
}

module.exports = _module => new ConfigMenu(_module)