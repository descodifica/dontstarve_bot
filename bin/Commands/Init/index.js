// Importa comando padrão
const DefaultCommand = require('../Default')

// O comando inicial
class Init extends DefaultCommand {
  /**
   * @description Método principal
   * @param {Object} __Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_Message, _config) {
    // Opções a serem exibidas
    const options = [
      {
        icon: 'theaterMasks',
        name: Dictionary.get('profile.profile', _config),
        value: Dictionary.get('profile.resume', _config),
      },
      {
        icon: 'stream',
        name: Dictionary.get('stream.stream', _config),
        value: Dictionary.get('stream.resume', _config),
      },
    ]

    // Se for dono do servidor, adiciona opção de configurações
    if (_Message.authorId() === _Message.serverOwnerID()) {
      options.push({
        icon: 'gear',
        name: Dictionary.get('config.config', _config),
        value: Dictionary.get('config.resume', _config),
      })
    }

    // Definições do menu
    const defs = { title: Dictionary.get('general.index', _config), options, }

    // Envia um prompt e chama o comando solicitado
    _Message.sendPrompt(defs).then(emoji => {
      let moduleName

      // Detecta nome do módulo
      switch (emoji._id) {
        case 'theaterMasks': moduleName = 'profile'
          break
        case 'gear': moduleName = 'config'
          break
        default: moduleName = emoji._id
          break
      }

      // Importa comando
      const command = require('../' + moduleName)

      // Executa comando
      if (command.main) {
        command.main(_Message, _config)
      }
      else {
        command.Menu.main(_Message, _config)
      }
    })
  }
}

module.exports = new Init()