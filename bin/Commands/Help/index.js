// Importa comando padrão
const DefaultCommand = require('../Default')

// O comando de ajuda
class Help extends DefaultCommand {
  /**
   * @description Método padrão quando nada for chamado
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_Message, _config) {
    // Recebe todos os módulos (respeitando o idioma)
    const modules = Object.values(Dictionary.sessions[_config.lang].texts)

    _Message.set(this._initialMessage(_config, 'COMMANDS'))
    _Message.setFromDictionary('help', 'VIEW_ALL_COMMANDS')

    // Percorre todos os módulos e adiciona sua descrição à mensagem
    modules.map((moduleData, k) => {
      if (!moduleData.name) return

      const first = k === 0
      const last = k === modules.length + 1

      _Message.setExampleAndExplanation(
        `${_Message.serverConfig.prefix}${moduleData.name}`, moduleData.resume, {
          breakTop: !first,
          breakBottom: !last ? 2 : false,
        }
      )
    })

    // Prefixo + Comando de ajuda
    const dsHelp = _Message.serverConfig.prefix + Dictionary.getTranslateModule(
      _config.lang, 'help'
    )

    const translatedProfile = Dictionary.getTranslateModule(_config.lang, 'profile')

    // Entra com mensagem de detalhamento
    _Message.setFromDictionary(
      'help', 'VIEW_MORE_DETAILS_COMMAND', { command: dsHelp, }, { breakLine: 2, }
    )

    // Entra com titulo de exemplo
    _Message.setFromDictionary('general', 'EXAMPLE')

    // Exemplo
    _Message.set(`\`${dsHelp} ${translatedProfile}\``, { breakLine: 2, })

    // Entra com mensagem de ver do início
    _Message.setFromDictionary('help', 'SEE_FROM_THE_BEGINNING', { command: dsHelp, })

    // Responde
    _Message.send()
  }

  /**
   * @description Chama a ajuda de um dado comando
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  commandHelp (_Message, _config) {
    // Comando e método escolhidos
    const originalCommand = _Message.originalMethod
    const originalMethod = _Message.args[0]

    // Comando e método reais
    const realCommand = Dictionary.getModuleName(_config.lang, _Message.originalMethod)
    const realMethod = Dictionary.getMethodName(_config.lang, realCommand, originalMethod)

    // Recebe informações do comando escolhido
    const commandInfo = Dictionary.getModuleInfo(_config.lang, originalCommand)

    // Recebe o comando
    const command = require('../')[realCommand]

    // Prefixo + Comando de ajuda
    const dsHelp = _Message.serverConfig.prefix + Dictionary.getTranslateModule(
      _config.lang, 'help'
    )

    // Prefixo + comando de ajuda + comando
    const dsHelpCommand = dsHelp + ' ' + originalCommand

    // Prefixo + comando
    const dsCommand = _Message.serverConfig.prefix + originalCommand

    // Se o comando não existe, informa e finaliza
    if (!command) {
      _Message.sendFromDictionary('help', 'COMMAND_NOT_FOUND', {
        command: originalCommand,
        helpCommand: dsHelp,
      })

      return
    }

    // Mensagem inicial
    _Message.set(this._initialMessage(_config, 'METHODS'))

    // Se passou método
    if (originalMethod) {
      // Recebe informações do métdo escolhido
      const method = commandInfo.methods[realMethod]

      // Se não achou o método, informa e finaliza
      if (!method) {
        _Message.sendFromDictionary('help', 'METHOD_NOT_FOUND', { method: originalMethod, })

        return
      }

      _Message.setExampleAndExplanation(
        `${dsCommand} ${originalMethod}`,
        commandInfo.methods[realMethod].resume
      )

      _Message.set('\n\n')

      // Se tem doc, adiciona ela
      if (command.doc[realMethod]) {
        command.doc[realMethod](_Message, _config)
      }
      else {
        _Message.setFromDictionary('help', 'NO_INFO_AVAILABLE')
      }
    }
    else {
      _Message.setExampleAndExplanation(
        _Message.serverConfig.prefix + originalCommand, commandInfo.resume
      )

      if (commandInfo.methods) {
        _Message.set('\n\n')

        _Message.setFromDictionary(
          'help', 'VIEW_ALL_METHODS', {
            command: _Message.serverConfig.prefix + originalCommand,
          }
        )

        Object.values(commandInfo.methods).map((data, k) => {
          const first = k === 0
          const last = k === commandInfo.methods.length + 1

          _Message.setExampleAndExplanation(
            `${dsCommand} ${data.name}`, data.resume, {
              breakTop: !first,
              breakBottom: !last ? 2 : 0,
            }
          )
        })

        // Entra com mensagem de detalhamento
        _Message.setFromDictionary(
          'help', 'VIEW_MORE_DETAILS_METHOD', { command: dsHelpCommand, }, { breakLine: 2, }
        )

        // Entra com titulo de exemplo
        _Message.setFromDictionary('general', 'EXAMPLE')

        // Exemplo
        _Message.set(
          `\`${dsHelpCommand} ${Object.values(commandInfo.methods)[0].name}\``, { breakLine: 2, }
        )

        // Entra com mensagem de ver do início
        _Message.setFromDictionary(
          'help', 'SEE_FROM_THE_BEGINNING', { command: dsHelpCommand.split(' ')[0], }
        )
      }

      if (command.doc.main) {
        command.doc.main(_Message, _config)
      }

      if (!command.doc.main && !commandInfo.methods) {
        _Message.set('\n\n')
        _Message.setFromDictionary('help', 'NO_INFO_AVAILABLE')
      }
    }

    // Responde
    _Message.send()
  }

  /**
   * @description Chamado quando chamar um método não existente
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  invalidRedir (_Message, _config) {
    this.commandHelp(_Message, _config)
  }

  /**
   * @description Retorna mensagem inicial
   * @param {Object} _config As configurações do servidor
   * @param {String} _argName O nome do argumento a ser usado no texto
   */
  _initialMessage (_config, _argName) {
    return Dictionary.getMessage(_config, 'help', 'WELCOME') + '\n\n'
  }
}

module.exports = new Help()