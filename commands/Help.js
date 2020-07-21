// Importa função de mapeamento de objetos
const objectMap = require('object.map')

// Importa comando padrão
const DefaultCommand = require('./Default')

// Prefixo
const { prefix, } = require('../config')
const { resolveLangMessage, } = require('../lang')

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
    const modules = require('./')

    // Recebe o comando e retira dos argumentos
    // const module = _args.shift()

    // Mensagem a ser exibida
    const msg = [ this._initialMessage(_config, 'command'), ]

    // Percorre todos os módulos e adiciona sua descrição à mensagem
    objectMap(modules, (modleData, moduleName) => {
      msg.push(`> ${prefix}${moduleName} - ${Dictionary.getResume(_config.lang, moduleName)}`)
    })

    // Entra com mensagem de detalhamento
    msg.push(
      this._finalMessage(
        _config,
        'command',
        prefix + resolveLangMessage(_config.lang, {
          en: 'help',
          es: 'ayuda',
          ptbr: 'ajuda',
          zhcn: '救命',
        })
      )
    )

    // Responde
    _message.reply(msg.join('\n'))
  }

  /**
   * @description Chama a ajuda de um dado comando
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  commandHelp (_args, _message, _config) {
    // Ignora se pediu ajuda da ajuda
    const lang = resolveLangMessage(_config.lang, {
      en: 'help',
      es: 'ayuda',
      ptbr: 'ajuda',
      zhcn: '救命',
    })

    if (_args[0] === lang) return

    // Importa todos os comandos
    const commands = require('./')

    // Nome do comando escolhido
    const commandName = Dictionary.getModule(_config.lang, _args[0])

    // Importa o comando escolhido
    const command = commands[commandName]

    // Se o comando não existe, informa e finaliza
    if (!command) {
      _message.reply(Dictionary.getMessage(
        _config.lang, 'help', 'COMMAND_NOT_FOUND', { command: commandName, prefix, }
      ))

      return
    }

    // Mensagem a ser exibida
    let msg = []

    // Se passou método
    if (_args[1]) {
      // Importa o método escolhido
      const method = Dictionary.getMethod(_config.lang, commandName, _args[1])

      // Se não achou o método, informa e finaliza
      if (!method) {
        _message.reply(Dictionary.getMessage(
          _config.lang, 'help', 'METHOD_NOT_FOUND', { method: _args[1], }
        ))

        return
      }

      // Texto padrão
      msg.push(
        Dictionary.getMessage(
          _config.lang, 'help', 'VIEW_MORE_INFO', {
            prefix,
            command: commandName,
            method: _args[1],
          }
        ) + '\n'
      )

      msg.push(`${method.resume}\n`)

      // Se tem doc, adiciona ela
      if (method.doc) {
        // Se for string, vira array
        method.doc = typeof method.doc === 'string' ? [ method.doc, ] : method.doc

        // Concatena array da doc a mensagem
        msg = msg.concat(method.doc)
      }
      else {
        msg.push(Dictionary.getMessage(_config.lang, 'help', 'NO_INFO_AVAILABLE'))
      }
    }
    else {
      // Mensagem inicial
      msg.push(this._initialMessage(_config, 'method'))

      objectMap(command.methods[_config.lang], (data, method) => {
        msg.push(`> ${prefix}${_args[0]} ${method} - ${data.resume}`)
      })

      // Entra com mensagem de detalhamento
      msg.push(
        this._finalMessage(
          _config,
          'method',
          (
            prefix +
            resolveLangMessage(_config.lang, {
              en: 'help',
              es: 'ayuda',
              ptbr: 'ajuda',
              zhcn: '救命',
            }) +
            ' ' +
            _args[0]
          )
        )
      )
    }

    // Responde
    _message.reply(msg.join('\n'))
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
    switch (_argName) {
      case 'method': _argName = resolveLangMessage(_config.lang, {
        ptbr: 'métodos', en: 'methods', es: 'métodos', zhcn: '方法',
      })
        break
      case 'command': _argName = resolveLangMessage(_config.lang, {
        ptbr: 'comandos', en: 'commands', es: 'comandos', zhcn: '命令s',
      })
    }

    return Dictionary.getMessage(_config.lang, 'help', 'VIEW_ALL', { word: _argName, }) + '\n'
  }

  /**
   * @description Retorna mensagem final
   * @param {Object} _config As configurações do servidor
   * @param {String} _argName O nome do argumento a ser usado no texto
   * @param {String} _command O comando a ser exibido
   */
  _finalMessage (_config, _argName, _command) {
    switch (_argName) {
      case 'method': _argName = resolveLangMessage(_config.lang, {
        ptbr: 'método', en: 'method', zhcn: '方法',
      })
        break
      case 'command': _argName = resolveLangMessage(_config.lang, {
        ptbr: 'comando', en: 'command', es: 'método', zhcn: '命令',
      })
    }

    return '\n' + Dictionary.getMessage(
      _config.lang, 'help', 'VIEW_MORE_DETAILS', { command: _command, word: _argName, }
    ) + '\n'
  }
}

module.exports = new Help()