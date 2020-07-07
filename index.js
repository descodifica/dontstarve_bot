// Importa API do discord
const Discord = require('discord.js')

// Conexão com o banco
const Db = require('./Db')

// Importa todos os módulos
const commands = require('./commands')

// Importa entidade de configuração
const configEntity = require('./entities/Config')

// Importa configurações
const { token, prefix, } = require('./config')

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
  const serverConfig = (await configEntity.getBy({ server_id: message.guild.id.toString(), }))[0]

  // Comandos no idioma do servidor
  const translateCommands = commands[serverConfig.lang]

  // Recebe o comando (remove do primeiro argumento)
  const command = args.shift()

  // // Se não possui o comando, informa e finaliza
  if (!translateCommands[command]) {
    message.reply(`Comando ${command} não existe`)

    return
  }

  // Detecta nome do método (se não tiver, vira main)
  const method = translateCommands[command][args[0]] ? args.shift() : 'main'

  // Executa comando
  translateCommands[command].exec(method, args, message, serverConfig)
})

// Loga o cliente
client.login(token)