// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de configuração
const ConfigEntity = require('../entities/Config')

// O comando de configurações
class Config extends DefaultCommand {
  constructor () {
    // Seta os nomes dos métodos de acordo com o idioma do servidor
    super({
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

  // Método padrão quando nada for chamado
  main (_args, _message, _config) {
    // Impede uso se não for por usuário do servidor
    if (!this.authorOwnerServerID(_message)) {
      _message.reply('Esse comando só pode ser usado pelo dono do servidor!')

      return
    }

    // Dados da atualização
    const data = {}
    data[_args[0]] = _args[1]

    // Atualiza e responde
    ConfigEntity.update(data, { server_id: this.serverId(_message), })
      .then(() => {
        _message.reply('Configuração atualizada com sucesso')
      })
      .catch(() => {
        _message.reply('Ocorreu algum problema ao atualizar a configuração')
      })
  }
}

module.exports = new Config()