// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigEntity = require('../entities/Config')

// O comando de configurações
class Config extends DefaultCommand {
  constructor () {
    // Seta os nomes dos métodos de acordo com o idioma do servidor
    super({
      resume: 'Configura o bot no servidor (somente dono do servidor)',
      methodsDictionary: {
        ptbr: {
          lang: 'lang',
        },
        en: {
          lang: 'lang',
        },
      },
    })
  }

  /**
   * @description Método padrão quando nada for chamado
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _message, _config) {
    // Impede uso se não for por usuário do servidor
    if (!this.authorOwnerServerID(_message)) {
      _message.reply(
        resolveLangMessage(_config.lang, {
          ptbr: 'this command can only be used by the server owner!',
          en: 'esse comando só pode ser usado pelo dono do servidor!',
        })
      )

      return
    }

    // Dados da atualização
    const data = {}
    data[_args[0]] = _args[1]

    // Atualiza e responde
    ConfigEntity.update(data, { server_id: this.serverId(_message), })
      .then(() => {
        _message.reply(
          resolveLangMessage(_config.lang, {
            ptbr: 'configuração atualizada com sucesso',
            en: 'configuration updated successfully',
          })
        )
      })
      .catch(() => {
        _message.reply(
          resolveLangMessage(_config.lang, {
            ptbr: 'ocorreu algum problema ao atualizar a configuração',
            en: 'there was a problem updating the configuration',
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
}

module.exports = new Config()