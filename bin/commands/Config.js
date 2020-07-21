// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigEntity = require('../entities/Config')

// O comando de configurações
class Config extends DefaultCommand {
  constructor () {
    // Seta os nomes dos métodos de acordo com o idioma do servidor
    super({
      // methods: {
      //   ptbr: {
      //     lang: {
      //       resume: 'Altera o idioma do Bot',
      //       doc: [
      //         'Aceita os valores:\n',
      //         '> en - Inglês',
      //         '> es - Espanhol',
      //         '> ptbr - Portugês do Brasil',
      //         '> zhcn - Chinês Simplificado',
      //       ],
      //     },
      //   },
      //   en: {
      //     lang: {
      //       resume: 'Change the Bot language',
      //       doc: [
      //         'Accepts the values:\n',
      //         '> en - English',
      //         '> es - Spanish',
      //         '> ptbr - Brazilian Portuguese',
      //         '> zhcn - Simplified Chinese',
      //       ],
      //     },
      //   },
      //   es: {
      //     idioma: {
      //       resume: 'Cambiar el idioma del bot',
      //       doc: [
      //         'Acepta los valores:\n',
      //         '> en - Inglés',
      //         '> es - Español',
      //         '> ptbr - Portugués de Brasil',
      //         '> zhcn - Chino simplificado',
      //       ],
      //     },
      //   },
      //   zhcn: {
      //     语言: {
      //       resume: '更改机器人语言',
      //       doc: [
      //         '接受值:\n',
      //         '> en - 英语',
      //         '> es - 西班牙文',
      //         '> ptbr - 巴西葡萄牙语',
      //         '> zhcn - 简体中文',
      //       ],
      //     },
      //   },
      // },
    })
  }

  /**
   * @description Método de configuração de idioma
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  lang (_args, _message, _config) {
    // Importa os idiomas
    const langs = require('../../lang').langs

    // O idioma pedido
    const lang = _args[0]

    // Se idioma passado for inválido, informa e finalzia
    if (langs.indexOf(lang) === -1) {
      _message.reply(Dictionary.getMessage(_config.lang, 'config', 'INVALID_LANGUAGE', {
        lang, firstLangs: langs.slice(0, -1).join(', '), lastLang: langs.reverse()[0],
      }))

      return
    }

    // Configura
    this._config('lang', _args[0], _message, _config)
      .then(() => {
        _message.reply(Dictionary.getMessage(_args[0], 'config', 'UPDATED_LANGUAGE'))
      })
      .catch(() => {
        _message.reply(
          _message.reply(Dictionary.getMessage(_config.lang, 'config', 'UPDATE_LANGUAGE_ERROR'))
        )
      })
  }

  /**
   * @description Atualiza uma configuração
   * @param {String} _k Qual configuração a ser atualizada
   * @param {String} _v Valor da configuração a ser atualizada
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  _config (_k, _v, _message, _config) {
    // Impede uso se não for por usuário do servidor
    if (!this.authorOwnerServerID(_message)) {
      _message.reply(Dictionary.getMessage(_config.lang, 'general', 'OWNER_CONTROL_ONLY'))

      return false
    }

    // Dados da atualização
    const data = {}
    data[_k] = _v

    // Atualiza e responde
    return ConfigEntity.update(data, { server_id: this.serverId(_message), })
  }
}

module.exports = new Config()