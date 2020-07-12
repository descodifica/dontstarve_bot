// Importa função de mapeamento de objetos
const objectMap = require('object.map')

// Importa comando padrão
const DefaultCommand = require('./Default')

// Prefixo
const { prefix, } = require('../config')

// O comando de ajuda
class Help extends DefaultCommand {
  constructor () {
    // Seta os nomes dos métodos de acordo com o idioma do servidor
    super({
      resume: 'Busca ajuda do bot e de seus comandos',
    })
  }

  /**
   * @description Método padrão quando nada for chamado
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _message, _config) {
    this.moduleHelp(_args, _message, _config)
  }

  /**
   * @description Método a ser chamado quando pedir um método não existente
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  invalidRedir (_args, _message, _config) {
    this.moduleHelp(_args, _message, _config)
  }

  /**
   * @description Chama a ajuda de um dado módulo
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  moduleHelp (_args, _message, _config) {
    // Recebe todos os módulos (respeitando o idioma)
    const modules = require('./')[_config.lang]

    // Recebe o comando e retira dos argumentos
    const module = _args.shift()

    // Se tem comando
    if (module) {
      // Chama método de ajuda do módulo, passando os argumentos
      modules[module].help(_args, _message, _config)

      return
    }

    // Mensagem a ser exibida
    const msg = [
      resolveLangMessage(_config.lang, {
        ptbr: 'veja aqui uma lista de todos os comandos disponíveis',
        en: 'see here a list of all available commands',
      }) + '\n',
    ]

    // Percorre todos os módulos e adiciona sua descrição à mensagem
    objectMap(modules, (m, k) => {
      msg.push(`> ${prefix}${k} - ${m.resume}`)
    })

    msg.push(
      '\n' + resolveLangMessage(_config.lang, {
        ptbr: `Entre ${prefix}help seguido de um comando para ter maiores detalhes`,
        en: `Enter ${prefix} help followed by a command for more details`,
      })
    )

    // Responde
    _message.reply(msg.join('\n'))
  }
}

module.exports = new Help()