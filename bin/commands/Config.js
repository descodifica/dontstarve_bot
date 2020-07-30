// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigService = require('../services/Config')

// O comando de configurações
class Config extends DefaultCommand {
  /**
   * @description Método de configuração de idioma
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  lang (_Message, _config) {
    // Importa os idiomas
    const langs = require('../config').langs

    // O idioma pedido
    const lang = _Message.args[0]

    // Se idioma passado for inválido, informa e finalzia
    if (langs.indexOf(lang) === -1) {
      _Message.sendFromDictionary('config', 'INVALID_LANGUAGE', {
        lang,
        firstLangs: langs.slice(0, -1).join(', '),
        lastLang: langs.reverse()[0],
      })

      return
    }

    // Atualiza
    this._config('lang', lang, _Message)
      .then(() => {
        _Message.serverConfig.lang = _Message.args[0]

        _Message.sendFromDictionary('config', 'UPDATED_LANGUAGE')
      })
      .catch(e => {
        _Message.sendFromDictionary('config', 'UPDATE_LANGUAGE_ERROR')
      })
  }

  /**
   * @description Método de configuração de prefix
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  prefix (_Message, _config) {
    // O prefixo pedido
    const prefix = _Message.args[0]

    // Atualiza
    this._config('prefix', prefix, _Message)
      .then(() => {
        global.serverPrefix[_Message.serverId()] = _Message.args[0]

        _Message.sendFromDictionary('config', 'UPDATED_PREFIX')
      })
      .catch(e => {
        _Message.sendFromDictionary('config', 'UPDATE_PREFIX_ERROR')
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