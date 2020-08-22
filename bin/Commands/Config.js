// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigService = require('../Services/Config')
const { update, } = require('../Services/Config')

// O comando de configurações
class Config extends DefaultCommand {
  /**
   * @description Método principal
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_Message, _config) {
    _Message.sendPrompt({
      title: Dictionary.get('config.index', _config),
      options: [
        {
          icon: 'inputLatinLetters',
          name: Dictionary.get('config.language', _config),
          value: Dictionary.get('config.language_resume', _config),
          callback: () => this.lang(_Message, _config),
        },
        {
          icon: 'home',
          name: Dictionary.get('general.init', _config),
          value: Dictionary.get('general.backStart', _config),
          callback: () => require('./Init').main(_Message, _config),
        },
      ],
    })
  }

  /**
   * @description Método de configuração de idioma
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {String} _lang Idioma escolhido
   */
  async lang (_Message, _config, _lang) {
    _Message.sendPrompt({
      title: Dictionary.get('config.whatAge', _config),
      options: [
        {
          icon: 'brFlag',
          name: Dictionary.getLangName('ptbr'),
          callback: () => update('ptbr'),
        },
        {
          icon: 'gear',
          name: Dictionary.get('config.config', _config),
          value: Dictionary.get('config.backConfig', _config),
          callback: () => this.main(_Message, _config),
        },
        {
          icon: 'home',
          name: Dictionary.get('general.init', _config),
          value: Dictionary.get('general.backStart', _config),
          callback: () => require('./Init').main(_Message, _config),
        },
      ],
    })

    const update = _lang => {
      const data = { lang: _lang, }

      ConfigService.update(data, { server_id: _Message.serverId(), })
        .then(() => {
          return Dictionary.get('config.updateLanguage', _config)
        })
        .catch(e => {
          return Dictionary.get('config.updateLanguageError', _config)
        })
        .then(async title => {
          _Message.sendPrompt({
            title,
            options: [
              {
                icon: 'gear',
                name: Dictionary.get('config.config', _config),
                value: Dictionary.get('config.backConfig', _config),
                callback: () => this.main(_Message, _config),
              },
              {
                icon: 'home',
                name: Dictionary.get('general.init', _config),
                value: Dictionary.get('general.backStart', _config),
                callback: () => require('./Init').main(_Message, _config),
              },
            ],
          })
        })
    }
  }
}

module.exports = new Config()