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
  lang (_Message, _config, _lang) {
    // Atualiza
    this._config('lang', _lang, _Message)
      .then(() => {
        _Message.sendFromDictionary('config.updateLanguage', { ..._config, _lang, })
      })
      .catch(e => {
        _Message.sendFromDictionary('config.updateLanguageError', _config)
      })
  }

  /**
   * @description Atualiza uma configuração
   * @param {String} _prop Propriedade a ser atualizada
   * @param {String} _val Valor da propriedade
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  _config (_prop, _val, _Message) {
    // Impede uso se não for por usuário do servidor
    if (!_Message.authorOwnerServer()) {
      _Message.sendFromDictionary('general', 'OWNER_CONTROL_ONLY')

      return false
    }

    // Dados da atualização
    const data = {}
    data[_prop] = _val

    // Condições
    const where = { server_id: _Message.serverId(), }

    // Atualiza e responde
    return ConfigService.update(data, where, _prop, _Message.serverConfig)
  }
}

module.exports = new Config()