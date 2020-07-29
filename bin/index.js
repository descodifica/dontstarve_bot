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
    const ConfigEntity = require('./services/Config')

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
    // Recebe argumentos
    let args = _message.content

    // Pelo que trocar espaço dentro das aspas duplas
    const signal = '|_|'

    // Troca espaços entre aspas simples e duplas por |_|
    args = this.parserQuoteArgs(args, '\'', signal)
    args = this.parserQuoteArgs(args, '"', signal)

    return args
      .slice(prefix.length) // Remove o prefixo
      .split(' ') // Separa pelo espaço
      .filter(i => i.trim() !== '') // Remove argumento em branco (espaço extra no comando)
      .map(i => i.split(signal).join(' ')) // Volta espaço das aspas
  }

  /**
   * @description Retorna os argumentos com os espaços das aspas trocados
   * @param {Array} _args Os argumentos
   * @param {String} _quote As aspas usadas
   * @param {String} _signal O que por no lugar do espaço
   * @returns {Array} os argumentos com os espaços das aspas trocados
   */
  parserQuoteArgs (_args, _quote, _signal) {
    // Separa pelas aspas
    const args = _args.split(_quote)

    // Percorre todas as posições, começando pela primeira e pulando de 2 em em dois
    // Posição par é sempre com aspas
    for (let c = 1, max = args.length; c < max; c += 2) {
      // Troca espaço
      args[c] = args[c].split(' ').join(_signal)
    }

    // Une em string pelas aspas e retorna
    return args.join('')
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
        message.channel.send(
          Dictionary.getMessage(
            serverConfig, 'general', 'COMMAND_NOT_FOUND', { command: originalCommand, }
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

  /**
   * @description Informa que um método não existe
   * @params {Object} A mensagm
   * @params {String} _originalMethod Nome original do método pedido
   * @params {Object} _serverConfig Configurações do servidor
   */
  methodNotExists (_message, _originalMethod, _serverConfig) {
    _message.channel.send(
      Dictionary.getMessage(
        _serverConfig, 'general', 'METHOD_NOT_EXISTS', { method: _originalMethod, }
      )
    )
  }
}

// Cria o objeto do bot
global.Bot = new DontStarve()