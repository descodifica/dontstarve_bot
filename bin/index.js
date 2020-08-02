// Importa pacote de limpesa do terminal
// const clear = require('clear')

// Importa dicionário
require('./Dictionary')

// Importa API do discord
const Discord = require('discord.js')

// Conexão com o banco
const Db = require('./Db')

// Importa todos os módulos
const Commands = require('./Commands')

// Importa configurações
const { token, } = require('./config')
const Dictionary = require('./Dictionary')

// Lista de prefixo por servidor
global.serverPrefix = {}

// Classe principal do Bot
class DontStarve {
  // Ao criar o objeto
  constructor () {
    // Limpa terminal
    // clear()

    // Informa inicio
    console.log('Starting...')

    // Declara conexão com o cliente
    this.client = new Discord.Client()

    // Conecta ao banco
    Db.connect()

    // Executa ao iniciar
    this.onReady()

    // Executa quando entrar em um novo servidor
    this.onServerEnter()

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
      await ConfigEntity.create({ server_id: _Message.serverId(), })

      config = (await ConfigEntity.getBy({ server_id: _Message.serverId(), }))[0]
    }

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
   * @description Ao entrar em um novo servidor
   */
  onServerEnter () {
    this.client.on('guildCreate', async _server => {
      // Usuário dono do servidor
      const user = _server.owner

      // Nome do dono do servidor
      const userName = user.user.username

      // Nome do servidor
      const serverName = _server.name

      // Onde armazenar as mensagens
      const msgs = []

      // Percorre todos os idiomas
      Object.keys(Dictionary.langs()).map(lang => {
        // Adiciona mensagem de boas vindas no idioma
        msgs.push(
          Dictionary.getMessageInLang(
            lang, 'general', 'WELCOME', { userName, serverName, }, { prefix: 'ds:', }
          )
        )
      })

      // Envia mensagens
      await user.send(msgs.join('\n\n'))
    })
  }

  /**
   * @description Retorna o prefixo do servidor
   * @param {Object} _Message A mensagem enviada
   * @returns {String} O prefixo
   */
  async getServerPrefix (_Message) {
    // Id do servidor da mensagem
    const serverId = _Message.serverId()

    // Se não tem o ID na lista "quente" em código, busca e armazena nela
    if (!global.serverPrefix[serverId]) {
      global.serverPrefix[serverId] = (await this.getServerConfig(_Message)).prefix
    }

    // Retorna da lista quente
    return global.serverPrefix[serverId]
  }

  /**
   * @description Ao receber uma mensagem
   */
  onMessage () {
    // Quando receber uma mensagem
    this.client.on('message', async message => {
      // Recebe mensagem
      const Message = require('./Message')(message)

      // Finaliza se mensagem foi enviada por um bot
      if (Message.fromBot()) return

      // Prefixo a ser usado
      const prefix = await this.getServerPrefix(Message)

      // Se não for mensagem para o bot, finaliza
      if (!Message.forBot(prefix)) return {}

      // Configurações do servidor
      const serverConfig = Message.serverConfig = await this.getServerConfig(Message)

      // Trata os argumentos da mensagem
      Message.parserArgs()

      // Se não possui o comando, informa e finaliza
      if (!Commands[Message.realCommand]) {
        Message.sendFromDictionary('general', 'COMMAND_NOT_FOUND', { command: Message.command, })

        return
      }
      // Se método não existe
      if (!Message.realMethod) {
        // Se não tem método de redirecionar inválido, informa e finaliza
        if (!Commands[Message.realCommand].invalidRedir) {
          this.methodNotExists(Message, Message.method, serverConfig)

          return
        }
        else {
          Message.realMethod = 'invalidRedir'
        }
      }

      // Executa comando
      Commands[Message.realCommand].exec(Message)
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