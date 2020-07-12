// Importa API do discord
const Discord = require('discord.js')

// Conexão com o banco
const Db = require('./Db')

// Importa todos os módulos
const commands = require('./commands')

// Importa configurações
const { token, prefix, } = require('./config')

// Adiciona nas globais a função de envio de mensagem
global.resolveLangMessage = require('./lang').resolveLangMessage

// Classe principal do bot
class DontStarve {
  // Ao criar o objeto
  constructor () {
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
      // Se a mensagem não começar com o prefixo ou for debot, finaliza
      if (!message.content.startsWith(prefix) || message.author.bot) return {}

      // Recebe todos os argumentos do comando, garantindo que não haja nada em branco
      const args = this.getArgs(message)

      // Configurações do servidor
      const serverConfig = await this.getServerConfig(message)

      // Comandos no idioma do servidor
      const translateCommands = commands[serverConfig.lang]

      // Recebe o comando (remove do primeiro argumento)
      const command = args.shift()

      // Se não possui o comando, informa e finaliza
      if (!translateCommands[command]) {
        message.reply(
          resolveLangMessage(serverConfig.lang, {
            ptbr: `comando ${command} não existe`,
            en: `command ${command} does not exist`,
          })
        )

        return
      }

      // Se não passou método, vira main
      if (!args[0]) {
        args[0] = 'main'
      }

      // Se método não existe
      if (!translateCommands[command].methodExists(args[0], serverConfig.lang)) {
        // Se não tem método de redirecionar inválido, informa e finaliza
        if (!translateCommands[command].invalidRedir) {
          message.reply(
            resolveLangMessage(serverConfig.lang, {
              ptbr: `método ${args[0]} não existe`,
              en: `method ${args[0]} does not exist`,
            })
          )

          return
        }
        // Se tem o método, vira método a ser usado
        else {
          args.unshift('invalidRedir')
        }
      }

      // Detecta nome do método (se não existir, vira main)
      const method = args.shift()

      // Executa comando
      translateCommands[command].exec(method, args, message, serverConfig)
    })
  }
}

// Cria o objeto do bot
new DontStarve()