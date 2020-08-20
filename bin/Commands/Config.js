// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigService = require('../Services/Config')

// O comando de configurações
class Config extends DefaultCommand {
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
   * @description Método de configuração de idioma
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {String} _lang Idioma escolhido
   */
  async lang (_Message, _config, _lang) {
    // Opções do menu
    const langOptions = [
      {
        icon: 'brFlag',
        name: Dictionary.getLangName('ptbr'),
      },
    ]

    // Definições do menu
    const defs = {
      title: Dictionary.get('config.whatAge', _config),
      options: langOptions,
    }

    // Dados a serem atualizados
    const data = {}

    // Envia menu
    const emoji = await _Message.sendPrompt(defs)

    // Detecta idioma
    switch (emoji._id) {
      case 'brFlag': data.lang = 'ptbr'
        break
    }

    // Opções
    const options = [
      {
        icon: 'home',
        name: Dictionary.get('general.init', _config),
        value: Dictionary.get('general.backStart', _config),
      },
      {
        icon: 'gear',
        name: Dictionary.get('config.config', _config),
        value: Dictionary.get('config.backConfig', _config),
      },
    ]

    // Atualiza e responde
    return ConfigService.update(data, { server_id: _Message.serverId(), })
      .then(() => {
        return Dictionary.get('config.updateLanguage', _config)
      })
      .catch(e => {
        return Dictionary.get('config.updateLanguageError', _config)
      })
      .then(async title => {
        const emoji = await _Message.sendPrompt({ title, options, })

        // Executa o comando pedido
        switch (emoji._id) {
          case 'home': require('./Init').main(_Message, _config)
            break
          case 'gear': this.main(_Message, _config)
            break
        }
      })
  }
}

module.exports = new Config()