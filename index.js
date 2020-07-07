// Importa API do discord
const Discord = require('discord.js')

// Conexão com o banco
const Db = require('./Db')

// Importa todos os módulos
const commands = require('./commands')

// Importa configurações
const { token, prefix, } = require('./config')

// Adiciona nas globais a função de envio de mensagem
global.resolveLangMessage = require('./resolveLangMessage')

// Retorna configurações do servidor
async function getServerConfig (_message) {
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

// Declara conexão com o cliente
const client = new Discord.Client()

// Conecta ao banco
Db.connect()

// Quando iniciar
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

// Quando receber uma mensagem
client.on('message', async message => {
  // Se a mensagem não começar com o prefixo ou for de boot, finaliza
  if (!message.content.startsWith(prefix) || message.author.bot) return {}

  // Recebe todos os argumentos do comando, garantindo que não haja nada em branco
  const args = message.content
    .slice(prefix.length)
    .split(' ')
    .filter(i => i.trim() !== '')
    .map(i => i.toLowerCase())

  // Configurações do servidor
  const serverConfig = await getServerConfig(message)

  // Comandos no idioma do servidor
  const translateCommands = commands[serverConfig.lang]

  // Recebe o comando (remove do primeiro argumento)
  const command = args.shift()

  // Se não possui o comando, informa e finaliza
  if (!translateCommands[command]) {
    message.reply(
      resolveLangMessage(serverConfig.lang, {
        ptbr: `Comando ${command} não existe`,
        en: `Command ${command} does not exist`,
      })
    )

    return
  }

  // Se não passou método, vira main
  if (!args[0]) {
    args[0] = 'main'
  }

  // Se método não existe, informa e finaliza
  if (!translateCommands[command].methodExists(args[0], serverConfig.lang)) {
    message.reply(
      resolveLangMessage(serverConfig.lang, {
        ptbr: `Método ${args[0]} não existe`,
        en: `Method ${args[0]} does not exist`,
      })
    )

    return
  }

  // Detecta nome do método (se não tiver, vira main)
  const method = translateCommands[command][args[0]] ? args.shift() : 'main'

  // Executa comando
  translateCommands[command].exec(method, args, message, serverConfig)
})

// Loga o cliente
client.login(token)