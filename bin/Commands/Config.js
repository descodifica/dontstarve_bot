// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigService = require('../Services/Config')

// O comando de configurações
class Config extends DefaultCommand {
  constructor (_Message, _config) {
    super({
      options: {
        backConfigModule: (_Message, _config) => {
          return {
            icon: 'gear',
            name: Dictionary.get('config.config', _config),
            value: Dictionary.get('config.backConfig', _config),
            callback: () => this.main(_Message, _config),
          }
        },
      },
    })
  }

  /**
   * @description Método principal
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_Message, _config) {
    const defs = {
      title: Dictionary.get('config.index', _config),
      options: {
        main: [
          {
            icon: 'inputLatinLetters',
            name: Dictionary.get('config.language', _config),
            value: Dictionary.get('config.language_resume', _config),
            callback: () => this.lang(_Message, _config),
          },
        ],
        'general.navegateGroupOptions': [
          require('./Init').options.backStart(_Message, _config),
        ],
      },
    }

    _Message.sendPrompt(defs, _config)
  }

  /**
   * @description Método de configuração de idioma
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {String} _lang Idioma escolhido
   */
  lang (_Message, _config, _lang) {
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
          const defs = {
            title,
            options: [
              this.options.backConfigModule(_Message, _config),
              require('./Init').options.backStart(_Message, _config),
            ],
          }

          _Message.sendPrompt(defs, _config)
        })
    }

    const defs = {
      title: Dictionary.get('config.whatAge', _config),
      options: {
        main: [
          {
            icon: 'brFlag',
            name: Dictionary.getLangName('ptbr'),
            callback: () => update('ptbr'),
          },
        ],
        'general.navegateGroupOptions': [
          this.options.backConfigModule(_Message, _config),
          require('./Init').options.backStart(_Message, _config),
        ],
      },
    }

    _Message.sendPrompt(defs, _config)
  }
}

module.exports = new Config()