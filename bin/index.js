// Importa dicionário
require('./Dictionary')

// Importa emojis
require('./Emojis')

// Importa API do discord
const Discord = require('discord.js')

// Importa configurações
const { token, environment, } = require('./config')
const Dictionary = require('./Dictionary')

// Lista de prefixo por servidor
global.serverPrefix = {}

// Classe principal do Bot
class DontStarve {
  // Ao criar o objeto
  constructor () {
    // Limpa terminal
    if (environment === 'development') {
      require('clear')()
    }

    // Informa inicio
    console.log('Starting...')

    // Declara conexão com o cliente
    global.Client = new Discord.Client()

    // Executa ao iniciar
    this.onReady()

    // Executa quando entrar em um novo servidor
    this.onServerEnter()

    // Executa ao receber uma mensagem
    this.onMessage()

    // Loga o cliente
    Client.login(token)
  }

  /**
   * @description Retorna dados do Bot
   * @returns {Object}
   */
  bot () {
    return Client.user
  }

  /**
   * @description Retorna o nome do Bot
   * @returns {String}
   */
  botName () {
    return this.bot().name
  }

  /**
   * @description Retorna o id do Bot
   * @returns {String}
   */
  botId () {
    return this.bot().id
  }

  /**
   * @description Retorna configurações do servidor
   * @params {Object} _Message Objeto da mensagem
   * @returns {Object} Objeto com as configurações do servidor
   */
  async getServerConfig (_Message) {
    // Importa entidade de configuração
    const ConfigEntity = require('./Services/Config')

    // Captura configurações
    let config = (await ConfigEntity.getBy({ server_id: _Message.serverId(), }))[0]

    // Se não achou, cria
    if (!config) {
      config = await ConfigEntity.create({ server_id: _Message.serverId(), })
    }

    // Retorna
    return config
  }

  /**
   * @description Ao inciar
   */
  onReady () {
    // Quando iniciar
    Client.on('ready', () => {
      console.log(`Logged in as ${Client.user.tag}!`)
    })
  }

  /**
   * @description Ao entrar em um novo servidor
   */
  onServerEnter () {
    Client.on('guildCreate', async _server => {
      // Usuário dono do servidor
      const user = _server.owner

      // Nome do dono do servidor
      const userName = user.user.username

      // Nome do servidor
      const serverName = _server.name

      // Onde armazenar as mensagens
      const msgs = []

      // Percorre todos os idiomas
      Dictionary.langs().map(lang => {
        // Adiciona mensagem de boas vindas no idioma
        msgs.push(
          Dictionary.flag(lang) +
          ' ' +
          Dictionary.get(
            'general.welcome',
            { lang, },
            { userName: `**${userName}**`, serverName: `**${serverName}**`, }
          ) +
          '\n\n' +
          Dictionary.get('general.welcome_use', { lang, }) +
          '\n\n' +
          '**' + Dictionary.get('general.example', { lang, }) + '**:' +
          `${require('./Message')().mention(this.botId())}`
        )
      })

      // Envia mensagens
      await user.send(msgs.join('\n\n\n'))
    })
  }

  /**
   * @description Ao receber uma mensagem
   */
  onMessage () {
    // Quando receber uma mensagem
    Client.on('message', async message => {
      // Recebe mensagem
      const Message = require('./Message')(message)

      // Finaliza se mensagem foi enviada por um bot
      if (Message.fromBot()) return

      // Se não for mensagem para o bot, finaliza
      if (!Message.forBot(this.bot())) return {}

      // Configurações do servidor
      const serverConfig = await this.getServerConfig(Message)

      // Opções a serem exibidas
      const options = [
        {
          icon: 'profile',
          name: Dictionary.get('profile.profile', serverConfig),
          value: Dictionary.get('profile.resume', serverConfig),
        },
        {
          icon: 'stream',
          name: Dictionary.get('stream.stream', serverConfig),
          value: Dictionary.get('stream.resume', serverConfig),
        },
      ]

      // Se for dono do servidor, adiciona opção de configurações
      if (Message.authorId() === Message.serverOwnerID()) {
        options.push({
          icon: 'config',
          name: Dictionary.get('config.config', serverConfig),
          value: Dictionary.get('config.resume', serverConfig),
        })
      }

      // Definições do menu
      const defs = { title: Dictionary.get('general.index', serverConfig), options, }

      // Envia um prompt e chama o comando solicitado
      Message.sendPrompt(defs).then(emoji => {
        // Importa comando
        const command = require('./Commands')[emoji._id]

        // Executa comando
        if (command.main) {
          command.main(Message, serverConfig)
        }
        else {
          command.Menu.main(Message, serverConfig)
        }
      })
    })
  }
}

// Cria o objeto do Bot
global.Bot = new DontStarve()