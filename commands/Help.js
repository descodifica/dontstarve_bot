// Importa função de mapeamento de objetos
const objectMap = require('object.map')

// Importa comando padrão
const DefaultCommand = require('./Default')

// Prefixo
const { prefix, } = require('../config')
const { resolveLangMessage, } = require('../lang')

// O comando de ajuda
class Help extends DefaultCommand {
  constructor () {
    // Seta os nomes dos métodos de acordo com o idioma do servidor
    super({
      resume: {
        ptbr: 'Busca ajuda do bot e de seus comandos',
        en: 'Seek help from the bot and its commands',
        es: 'Busque ayuda del bot y sus comandos',
        zhcn: '向机器人及其命令寻求帮助',
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
    // Recebe todos os módulos (respeitando o idioma)
    const modules = require('./')[_config.lang]

    // Recebe o comando e retira dos argumentos
    const module = _args.shift()

    // Se tem comando
    if (module && module.help) {
      // Chama método de ajuda do módulo, passando os argumentos
      modules[module].help(_args, _message, _config)

      return
    }

    // Mensagem a ser exibida
    const msg = [ this._initialMessage(_config, 'command'), ]

    // Percorre todos os módulos e adiciona sua descrição à mensagem
    objectMap(modules, (m, k) => {
      msg.push(`> ${prefix}${k} - ${resolveLangMessage(_config.lang, m.resume)}`)
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
    const commands = require('./')[_config.lang]

    // Importa o comando escolhido
    const command = commands[_args[0]]

    // Se o comando não existe, informa e finaliza
    if (!command) {
      _message.reply(
        resolveLangMessage(_config.lang, {
          ptbr: `o comando "${_args[0]}" não existe, entre "${prefix}ajuda" para ver todos os ` +
            'comandos',
          es: `el comando "${_args[0]}" no existe, ingrese "${prefix}ayuda" para ver todos los ` +
            'comandos',
          en: `the command" ${_args[0]} "does not exist, between "${prefix}help" to see all ` +
            'commands',
          zhcn: `命令 "${_args[0]}" 不存在，输入 "${prefix}救命" 以查看所有命令`,
        })
      )

      return
    }

    // Mensagem a ser exibida
    let msg = []

    // Se passou método
    if (_args[1]) {
      // Importa o método escolhido
      const method = command.methods[_config.lang][_args[1]]

      // Se não achou o método, informa e finaliza
      if (!method) {
        _message.reply(
          resolveLangMessage(_config.lang, {
            en: `Method "${_args[1]}" not found`,
            es: `Método "${_args[1]}" no encontrado`,
            ptbr: `Método "${_args[1]}" não encontrado`,
            zhcn: `找不到方法 "${_args[1]}"`,
          }))

        return
      }

      // Texto padrão
      msg.push(
        resolveLangMessage(_config.lang, {
          ptbr: `Veja maiores informações de ${prefix}${_args[0]} ${_args[1]}:\n`,
          en: `See more information about ${prefix} ${_args[0]} ${_args[1]}: \n`,
          es: `Ver más información sobre ${prefix} ${_args[0]} ${_args[1]}:\n`,
          zhcn: `查看有关 ${prefix} ${_args[0]} ${_args[1]} 的更多信息：\n`,
        }))
      msg.push(`${method.resume}\n`)

      // Se tem doc, adiciona ela
      if (method.doc) {
        // Se for string, vira array
        method.doc = typeof method.doc === 'string' ? [ method.doc, ] : method.doc

        // Concatena array da doc a mensagem
        msg = msg.concat(method.doc)
      }
      else {
        msg.push(
          resolveLangMessage(_config.lang, {
            ptbr: 'Nenhuma informação extra disponível',
            en: 'No extra information available',
            es: 'No hay información adicional disponible',
            zhcn: '没有可用的额外信息',
          }))
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

    return resolveLangMessage(_config.lang, {
      ptbr: `veja aqui uma lista de todos os ${_argName} disponíveis`,
      en: `see here a list of all available ${_argName}`,
      es: `mira aquí una lista de todos los ${_argName} disponibles`,
      zhcn: `在这里看到所有可用的 ${_argName} 的列表`,
    }) + '\n'
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

    return '\n' + resolveLangMessage(_config.lang, {
      ptbr: `Entre "${_command}" seguido de um ${_argName} para ter maiores detalhes`,
      en: `Enter" "${_command}" followed by a ${_argName} for more details`,
      es: `Ingrese "${_command}" seguido de un ${_argName} para más detalles`,
      zhcn: `输入 "${_command}" ，然后输入 ${_argName} 以获取更多详细信息`,
    }) + '\n'
  }
}

module.exports = new Help()