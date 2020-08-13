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
    // Envia menu
    _Message.sendPrompt(
      {
        title: 'O que deseja configurar?',
        options: { inputLatinLetters: 'Idioma', raisedRand: 'Prefixo ', },
        callback: emoji => {
          switch (emoji._id) {
            case 'inputLatinLetters': this.lang(_Message, _config)
              break
            case 'raisedRand': this.prefix(_Message, _config)
          }
        },
      }
    )
  }

  /**
   * @description Configuração de idioma
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  lang (_Message, _config) {
    // Envia menu
    _Message.sendPrompt(
      {
        title: 'Qual idoma deseja?',
        options: { brFlag: 'Portugês Brasil', },
        callback: emoji => {
          switch (emoji._id) {
            case 'brFlag': _Message.args[0] = 'ptbr'
              break
          }

          this.module.lang(_Message, _config)
        },
      }
    )
  }

  /**
   * @description Configuração de prefixo
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async prefix (_Message, _config) {
    // Envia pergunta e recebe resposta
    const prefix = await _Message.ask('Qual prefixo deseja usar?')

    // Adiciona mensagem nos argumentos
    _Message.args[0] = prefix

    // Chama método de configuração de prefixo
    this.module.prefix(_Message, _config)
  }
}

module.exports = _module => new ConfigMenu(_module)