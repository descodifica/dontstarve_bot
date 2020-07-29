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

// Classe principal do Bot
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
   * @params {Object} _Message Objeto da mensagem
   * @returns {Object} Objeto com as configurações do servidor
   */
  async getServerConfig (_Message) {
    // Importa entidade de configuração
    const ConfigEntity = require('./services/Config')

    // Captura configurações
    let config = (await ConfigEntity.getBy({ server_id: _Message.serverId(), }))[0]

    // Se não achou, cria
    if (!config) {
      await ConfigEntity.create({ server_id: _Message.guild.id.toString(), })

      config = (await ConfigEntity.getBy({ server_id: _Message.serverId(), }))[0]
    }

    // Seta configurações na mensagem
    _Message.serverConfig = { ...config, prefix, }

    // Retorna
    return config
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
      // Recebe mensagem
      const Message = require('./Message')(message)

      // Se a mensagem não for para o Bot, finaliza
      if (!Message.forBot()) return {}

      // Configurações do servidor
      const serverConfig = await this.getServerConfig(Message)

      // Recebe o comando original (remove do primeiro argumento)
      const originalCommand = Message.command

      // Traduz o comando
      const command = Dictionary.getModuleName(serverConfig.lang, originalCommand)

      // Se não possui o comando, informa e finaliza
      if (!Commands[command]) {
        Message.sendFromDictionary('general', 'COMMAND_NOT_FOUND', { command: originalCommand, })

        return
      }

      // Método original
      const originalMethod = Message.method || 'main'

      // Traduz método
      let method = Dictionary.getMethodName(serverConfig.lang, command, originalMethod)

      // Se método não existe
      if (!method) {
        // Se não tem método de redirecionar inválido, informa e finaliza
        if (!Commands[command].invalidRedir) {
          this.methodNotExists(Message, originalMethod, serverConfig)

          return
        }
        else {
          Message.args.unshift(originalMethod)

          method = 'invalidRedir'
        }
      }

      // Executa comando
      Commands[command].exec(method || 'main', Message)
    })
  }

  /**
   * @description Informa que um método não existe
   * @params {Object} A mensagm
   * @params {String} _originalMethod Nome original do método pedido
   * @params {Object} _serverConfig Configurações do servidor
   */
  methodNotExists (_Message, _originalMethod, _serverConfig) {
    _Message.sendFromDictionary('general', 'METHOD_NOT_EXISTS', { method: _originalMethod, })
  }
}

// Cria o objeto do Bot
global.Bot = new DontStarve()