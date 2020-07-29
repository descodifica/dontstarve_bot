// Importa função de mapeamento de objetos
const objectMap = require('object.map')

// Importa comando padrão
const DefaultCommand = require('./Default')

// Prefixo
const { prefix, } = require('../config')

// O comando de ajuda
class Help extends DefaultCommand {
  /**
   * @description Método padrão quando nada for chamado
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _message, _config) {
    // Recebe todos os módulos (respeitando o idioma)
    const modules = Dictionary.sessions[_config.lang]

    // Mensagem a ser exibida
    const msg = [ this._initialMessage(_config, 'COMMANDS'), ]

    // Percorre todos os módulos e adiciona sua descrição à mensagem
    objectMap(modules, moduleData => {
      if (!moduleData.name) return

      msg.push(`> ${prefix}${moduleData.name} - ${moduleData.resume}`)
    })

    // Entra com mensagem de detalhamento
    msg.push(
      this._finalMessage(
        _config,
        'COMMAND',
        prefix + Dictionary.getTranslateModule(_config.lang, 'help')
      )
    )

    // Responde
    _message.channel.send(msg.join('\n'))
  }

  /**
   * @description Chama a ajuda de um dado comando
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  commandHelp (_args, _message, _config) {
    // Nome do módulo de ajuda traduzido no idioma do servidor
    const translateHelp = Dictionary.getTranslateModule(_config.lang, 'help')

    // Ignora se pediu ajuda da ajuda
    if (_args[0] === translateHelp) return

    // Comando escolhido original
    const originalCommand = _args.shift()

    // Nome do comando escolhido
    const commandName = Dictionary.getModuleName(_config.lang, originalCommand)

    // Recebe informações do comando escolhido
    const commandInfo = Dictionary.getModuleInfo(_config.lang, originalCommand)

    // Se o comando não existe, informa e finaliza
    if (!commandInfo) {
      _message.channel.send(Dictionary.getMessage(
        _config, 'help', 'COMMAND_NOT_FOUND', { command: originalCommand, prefix, }
      ))

      return
    }

    // Mensagem a ser exibida
    let msg = [ [], ]

    // Método original
    const originalMethod = _args.shift()

    // Se passou método
    if (originalMethod) {
      // Nome do método escolhido
      const methodName = Dictionary.getMethodName(_config.lang, commandName, originalMethod)

      // Recebe informações do métdo escolhido
      const method = commandInfo.methods[methodName]

      // Se não achou o método, informa e finaliza
      if (!method) {
        _message.channel.send(Dictionary.getMessage(
          _config, 'help', 'METHOD_NOT_FOUND', { method: originalMethod, }
        ))

        return
      }

      // Texto padrão
      msg[0].push(
        Dictionary.getMessage(
          _config, 'help', 'VIEW_MORE_INFO', {
            command: originalCommand,
            method: originalMethod,
          }
        ) + '\n'
      )

      msg[0].push(`${method.resume}\n`)

      // Se tem doc, adiciona ela
      if (method.doc) {
        // Se for função, executa e recebe resultado
        method.doc = typeof method.doc === 'function' ? method.doc(_config) : method.doc

        // Se for string, vira array
        method.doc = typeof method.doc === 'string' ? [ method.doc, ] : method.doc

        // Concatena array da doc a mensagem
        msg = msg.concat(method.doc)
      }
      else {
        msg[0].push(Dictionary.getMessage(_config, 'help', 'NO_INFO_AVAILABLE'))
      }
    }
    else {
      // Mensagem inicial
      msg[0].push(this._initialMessage(_config, 'METHODS'))

      objectMap(commandInfo.methods, (data, method) => {
        msg[0].push(`> ${prefix}${originalCommand} ${data.name} - ${data.resume}`)
      })

      // Entra com mensagem de detalhamento
      msg[0].push(
        this._finalMessage(_config, 'METHOD', prefix + translateHelp + ' ' + originalCommand)
      )
    }

    // Responde
    msg.map(m => _message.channel.send(m.join('\n')))
  }

  /**
   * @description Chamado quando chamar um método não existente
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  invalidRedir (_args, _message, _config) {
    this.commandHelp(_args, _message, _config)
  }

  /**
   * @description Retorna mensagem inicial
   * @param {Object} _config As configurações do servidor
   * @param {String} _argName O nome do argumento a ser usado no texto
   */
  _initialMessage (_config, _argName) {
    const argName = Dictionary.getMessage(_config, 'general', _argName)

    return Dictionary.getMessage(_config, 'help', 'VIEW_ALL', { word: argName, }) + '\n'
  }

  /**
   * @description Retorna mensagem final
   * @param {Object} _config As configurações do servidor
   * @param {String} _argName O nome do argumento a ser usado no texto
   * @param {String} _command O comando a ser exibido
   */
  _finalMessage (_config, _argName, _command) {
    const argName = Dictionary.getMessage(_config, 'general', _argName)

    return '\n' + Dictionary.getMessage(
      _config, 'help', 'VIEW_MORE_DETAILS', { command: _command, word: argName, }
    ) + '\n'
  }
}

module.exports = new Help()