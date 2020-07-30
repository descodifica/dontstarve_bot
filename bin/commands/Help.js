// Importa comando padrão
const DefaultCommand = require('./Default')

// O comando de ajuda
class Help extends DefaultCommand {
  /**
   * @description Método padrão quando nada for chamado
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_Message, _config) {
    // Recebe todos os módulos (respeitando o idioma)
    const modules = Object.values(Dictionary.sessions[_config.lang])

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

    // Entra com mensagem de detalhamento
    _Message.set(
      this._finalMessage(
        _config,
        'COMMAND',
        _Message.serverConfig.prefix + Dictionary.getTranslateModule(_config.lang, 'help')
      )
    )

    // Responde
    _Message.send()
  }

  /**
   * @description Chama a ajuda de um dado comando
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  commandHelp (_Message, _config) {
    // Nome do módulo de ajuda traduzido no idioma do servidor
    const translateHelp = Dictionary.getTranslateModule(_config.lang, 'help')

    // Comando escolhido original
    const originalCommand = _Message.args.shift()

    // Nome do comando escolhido
    const commandName = Dictionary.getModuleName(_config.lang, originalCommand)

    // Recebe informações do comando escolhido
    const commandInfo = Dictionary.getModuleInfo(_config.lang, originalCommand)

    // Se o comando não existe, informa e finaliza
    if (!commandInfo) {
      _Message.send('help', 'COMMAND_NOT_FOUND', {
        command: originalCommand,
        prefix: _Message.serverConfig.prefix,
      })

      return
    }

    // Método original
    const originalMethod = _Message.args.shift()

    // Mensagem inicial
    _Message.set(this._initialMessage(_config, 'METHODS'))

    // Se passou método
    if (originalMethod) {
      // Nome do método escolhido
      const methodName = Dictionary.getMethodName(_config.lang, commandName, originalMethod)

      // Recebe informações do métdo escolhido
      const method = commandInfo.methods[methodName]

      // Se não achou o método, informa e finaliza
      if (!method) {
        _Message.sendFromDictionary('help', 'METHOD_NOT_FOUND', { method: originalMethod, })

        return
      }

      _Message.setExampleAndExplanation(
        `${_Message.serverConfig.prefix}${originalCommand} ${originalMethod}`, method.resume
      )

      _Message.set('\n\n')

      // Se tem doc, adiciona ela
      if (method.doc) {
        method.doc(_Message, _config)
      }
      else {
        _Message.setFromDictionary('help', 'NO_INFO_AVAILABLE')
      }
    }
    else {
      _Message.setExampleAndExplanation(
        _Message.serverConfig.prefix + originalCommand, commandInfo.resume
      )

      _Message.set('\n\n')

      if (commandInfo.doc) {
        commandInfo.doc(_Message, _config)
      }
      else {
        _Message.setFromDictionary('help', 'NO_INFO_AVAILABLE')
      }

      if (commandInfo.methods) {
        _Message.setFromDictionary(
          'help', 'VIEW_ALL_METHODS', {
            command: _Message.serverConfig.prefix + originalCommand,
          }
        )

        Object.values(commandInfo.methods).map((data, k) => {
          const first = k === 0
          const last = k === commandInfo.methods.length + 1

          _Message.setExampleAndExplanation(
            `${_Message.serverConfig.prefix}${originalCommand} ${data.name}`, data.resume, {
              breakTop: !first,
              breakBottom: !last ? 2 : 0,
            }
          )
        })

        // Entra com mensagem de detalhamento
        _Message.set(
          this._finalMessage(
            _config, 'METHOD', _Message.serverConfig.prefix + translateHelp + ' ' + originalCommand
          )
        )
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
    const argName = Dictionary.getMessage(_config, 'general', _argName)

    return Dictionary.getMessage(_config, 'help', 'WELCOME', { word: argName, }) + '\n\n'
  }

  /**
   * @description Retorna mensagem final
   * @param {Object} _config As configurações do servidor
   * @param {String} _argName O nome do argumento a ser usado no texto
   * @param {String} _command O comando a ser exibido
   */
  _finalMessage (_config, _argName, _command) {
    const argName = Dictionary.getMessage(_config, 'general', _argName)

    return Dictionary.getMessage(
      _config, 'help', 'VIEW_MORE_DETAILS', { command: _command, word: argName, }
    )
  }
}

module.exports = new Help()