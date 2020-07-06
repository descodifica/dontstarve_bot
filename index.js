// Importa API do discord
const Discord = require('discord.js')

// Conexão com o banco
const Db = require('./Db')

// Importa todos os módulos
const commands = require('./commands/ptbr')

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
client.on('message', message => {
    // Se a mensagem não começar com o prefixo ou for de boot, finaliza
    if (!message.content.startsWith(prefix) || message.author.bot) return {}

    // Recebe todos os argumentos do comando, garantindo que não haja nada em branco
    const args = message.content.slice(prefix.length).split(' ').filter(i => i.trim() !== '')

    // Recebe o comando (remove do primeiro argumento)
    const command = args.shift().toLowerCase()

    // Se não possui o comando, informa e finaliza
    if (!commands[command]) {
        message.reply(`Módulo ${command} não existe`)

        return
    }

    // Detecta nome do método (se não tiver, vira main)
    const method = (commands[command][args[0]] ? args.shift() : 'main').toLowerCase()

    // Executa comando
    commands[command].exec(method, args, message)
})

// Loga o cliente
client.login(token)