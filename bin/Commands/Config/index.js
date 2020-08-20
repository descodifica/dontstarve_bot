// Importa comando padrão
const DefaultCommand = require('../Default')

// Importa entidade padrão de configuração
const ConfigService = require('../../Services/Config')

// O comando de configurações
class Config extends DefaultCommand {
  /**
   * @description Método de configuração de idioma
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {String} _lang Idioma escolhido
   */
  async lang (_Message, _config, _lang) {
    const data = {}

    // Dados a serem atualizados
    data.lang = _lang

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
        return _Message.sendPrompt({
          title: Dictionary.get('config.updateLanguage', _config),
          options,
        })
      })
      .catch(e => {
        return _Message.sendPrompt({
          title: Dictionary.get('config.updateLanguageError', _config),
          options,
        })
      })
      .then(emoji => {
        // Executa o comando pedido
        switch (emoji._id) {
          case 'home': require('../Init').main(_Message, _config)
            break
          case 'gear': this.Menu.main(_Message, _config)
            break
        }
      })
  }
}

module.exports = new Config()