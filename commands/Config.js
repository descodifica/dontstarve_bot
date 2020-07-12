// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigEntity = require('../entities/Config')

// O comando de configurações
class Config extends DefaultCommand {
  constructor () {
    // Seta os nomes dos métodos de acordo com o idioma do servidor
    super({
      resume: {
        ptbr: 'Configura o bot no servidor (somente dono do servidor)',
        en: 'Configure the bot on the server (server owner only)',
      },
      methods: {
        ptbr: {
          lang: { name: 'lang', resume: 'Altera o idioma do Bot', },
        },
        en: {
          lang: { name: 'lang', resume: 'Change the Bot language', },
        },
      },
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
    const langs = require('../lang').langs

    // O idioma pedido
    const lang = _args[0]

    // Se idioma passado for inválido, informa e finalzia
    if (langs.indexOf(lang) === -1) {
      _message.reply(
        resolveLangMessage(_config.lang, {
          ptbr: `o idioma "${lang}" é inválido. Valores aceitos são: ` +
            `${langs.slice(0, -1).join(', ')} e ${langs.reverse()[0]}`,
          en: `the language" ${lang}" is invalid. Accepted values are: ` +
            `${langs.slice(0, -1).join(',')} and ${langs.reverse()[0]}`,
        })
      )

      return
    }

    // Configura
    this._config('lang', _args[0], _message, _config)
      .then(() => {
        _message.reply(
          resolveLangMessage(_args[0], {
            ptbr: 'idioma atualizado com sucesso',
            en: 'language updated successfully',
          })
        )
      })
      .catch(() => {
        _message.reply(
          resolveLangMessage(_config.lang, {
            ptbr: 'ocorreu um problema ao mudar o idioma',
            en: 'there was a problem changing the language',
          })
        )
      })
  }

  /**
   * @description Método de ajuda do comando
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  help (_args, _message, _config) {
    // Mensagem a ser exibida
    const msg = []

    // Seleciona pedido de ajuda
    switch (_args.join(' ')) {
      case '': {
        msg.push(
          resolveLangMessage(_config.lang, {
            ptbr: 'veja aqui uma lista de todos os comandos disponíveis',
            en: 'see here a list of all available commands',
          }) + '\n'
        )
      }
    }

    // Responde
    _message.reply(msg.join('\n'))
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
      _message.reply(
        resolveLangMessage(_config.lang, {
          ptbr: 'this command can only be used by the server owner!',
          en: 'esse comando só pode ser usado pelo dono do servidor!',
        })
      )

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