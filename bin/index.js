// Importa pacote de limpesa do terminal
const clear = require('clear')

// Importa dicionário
require('./Dictionary')

// Importa API do discord
const Discord = require('discord.js')

// Conexão com o banco
const Db = require('./Db')

// Importa todos os módulos
const Commands = require('./Commands')

// Importa configurações
const { token, prefix, } = require('./config')

// Classe principal do bot
class DontStarve {
  // Ao criar o objeto
  constructor () {
    // Limpa terminal
    clear()

    // Informa inicio
    console.log('Starting...')

    // Declara conexão com o cliente
    this.client = new Discord.Client()

    // Conecta ao banco
    Db.connect()

    // Executa ao iniciar
    this.onReady()

    // Executa ao receber uma mensagem
    this.onMessage()

    // Loga o cliente
    this.client.login(token)
  }

  /**
   * @description Retorna configurações do servidor
   * @params {Object} _message Objeto da mensagem
   * @returns {Object} Objeto com as configurações do servidor
   */
  async getServerConfig (_message) {
    // Importa entidade de configuração
    const ConfigEntity = require('./entities/Config')

    // Captura configurações
    let config = (await ConfigEntity.getBy({ server_id: _message.guild.id.toString(), }))[0]

    // Se não achou, cria
    if (!config) {
      await ConfigEntity.create({ server_id: _message.guild.id.toString(), })

      config = (await ConfigEntity.getBy({ server_id: _message.guild.id.toString(), }))[0]
    }

    // Retorna
    return config
  }

  /**
   * @description Retorna os argumentos da mensagem
   * @param {Object} _message Objeto da mensagem
   * @returns {Array} Array contendo todos os argumentos
   */
  getArgs (_message) {
    return _message.content
      .slice(prefix.length) // Remove o prefixo
      .split(' ') // Separa pelo espaço
      .filter(i => i.trim() !== '') // Remove argumento em branco (espaço extra no comando)
      .map(i => i.toLowerCase()) // Converte para minusculo
  }

  /**
   * @description Ao inciar
  */
  onReady () {
    // Quando iniciar
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`)
    })
  }

  /**
   * @description Ao receber uma mensagem
  */
  onMessage () {
    // Quando receber uma mensagem
    this.client.on('message', async message => {
      // Se a mensagem não começar com o prefixo ou for de bot, finaliza
      if (!message.content.startsWith(prefix) || message.author.bot) return {}

      // Recebe todos os argumentos do comando, garantindo que não haja nada em branco
      const args = this.getArgs(message)

      // Configurações do servidor
      const serverConfig = await this.getServerConfig(message)

      // Recebe o comando original (remove do primeiro argumento)
      const originalCommand = args.shift()

      // Traduz o comando
      const command = Dictionary.getModuleName(serverConfig.lang, originalCommand)

      // Se não possui o comando, informa e finaliza
      if (!Commands[command]) {
        message.reply(
          Dictionary.getMessage(
            serverConfig.lang, 'general', 'COMMAND_NOT_FOUND', { command: originalCommand, }
          )
        )

        return
      }

      // Se não passou método, vira main
      if (!args[0]) {
        args[0] = 'main'
      }

      // Método original
      const originalMethod = args.shift()

      // Traduz método
      let method = Dictionary.getMethodName(serverConfig.lang, command, originalMethod)

      // Se método não existe
      if (!method) {
        // Se não tem método de redirecionar inválido, informa e finaliza
        if (!Commands[command].invalidRedir) {
          this.methodNotExists(message, originalMethod, serverConfig)

          return
        }
        else {
          args.unshift(originalMethod)

          method = 'invalidRedir'
        }
      }

      // Executa comando
      Commands[command].exec(method || 'main', args, message, serverConfig)
    })
  }

  methodNotExists (_message, _originalMethod, _serverConfig) {
    _message.reply(
      Dictionary.getMessage(
        _serverConfig.lang, 'general', 'METHOD_NOT_EXISTS', { method: _originalMethod, }
      )
    )
  }
}

// Cria o objeto do bot
global.Bot = new DontStarve()