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
        es: 'Configura el bot en el servidor (solo el propietario del servidor)',
        zhcn: '在服务器上配置机械手（仅服务器所有者）',
      },
      methods: {
        ptbr: {
          lang: {
            name: 'lang',
            resume: 'Altera o idioma do Bot',
            doc: [
              'Aceita os valores:\n',
              '> en - Inglês',
              '> en - Espanhol',
              '> ptbr - Portugês do Brasil',
              '> zhcn - Chinês Simplificado',
            ],
          },
        },
        en: {
          lang: {
            name: 'lang',
            resume: 'Change the Bot language',
            doc: [
              'Accepts the values:\n',
              '> en - English',
              '> en - Spanish',
              '> ptbr - Brazilian Portuguese',
              '> zhcn - Simplified Chinese',
            ],
          },
        },
        es: {
          idioma: {
            name: 'lang',
            resume: 'Cambiar el idioma del bot',
            doc: [
              'Acepta los valores:\n',
              '> en - Inglés',
              '> es - Español',
              '> ptbr - Portugués de Brasil',
              '> zhcn - Chino simplificado',
            ],
          },
        },
        zhcn: {
          语言: {
            name: 'lang',
            resume: '更改机器人语言',
            doc: [
              '接受值:\n',
              '> en - 英语',
              '> es - 西班牙文',
              '> ptbr - 巴西葡萄牙语',
              '> zhcn - 简体中文',
            ],
          },
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
          es: `el idioma "${lang}" no es válido. Los valores aceptados son: ` +
            `${langs.slice(0, -1).join(',')} y ${langs.reverse()[0]}`,
          zhcn: `语言 "${lang}" 无效。 可接受的值是：` +
          `${langs.slice(0, -1).join(', ')}  ${langs.reverse()[0]}`,
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
            es: 'idioma actualizado con éxito',
            zhcn: '语言更新成功',
          })
        )
      })
      .catch(() => {
        _message.reply(
          resolveLangMessage(_config.lang, {
            ptbr: 'ocorreu um problema ao mudar o idioma',
            en: 'there was a problem changing the language',
            es: 'hubo un problema al cambiar el idioma',
            zhcn: '更改语言时出现问题',
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
            es: 'mira aquí una lista de todos los comandos disponibles',
            zhcn: '在这里查看所有可用命令的列表',
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
          ptbr: 'esse comando só pode ser usado pelo dono do servidor!',
          en: 'this command can only be used by the server owner!',
          es: '¡este comando solo puede ser utilizado por el propietario del servidor!',
          zhcn: '该命令只能由服务器所有者使用！',
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