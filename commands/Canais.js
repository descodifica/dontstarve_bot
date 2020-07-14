// Importa módulo de mensagem embutida
const { MessageEmbed, } = require('discord.js')

// Importa comando padrão
const DefaultCommand = require('./Default')

// Canais a serem listados
const channels = [
  {
    name: 'BrunoSystem',
    url: 'https://www.youtube.com/channel/UCEah_poYjR9ow1xATcfhamA',
  },
  {
    name: 'Guia do Mochileiro do Constant',
    url: 'https://www.youtube.com/channel/UCZrAV0CNMklFtyxkwILzfdg/',
  },
  {
    name: 'Inception7',
    url: 'https://www.youtube.com/user/cabelofis',
  },
  {
    name: 'ᴊᴏɢᴀᴛɪɴᴀʟɪᴢᴀɴᴅᴏ',
    url: 'https://www.youtube.com/channel/UCTan1eeYiGlm6NhFktsPGiA',
  },
  {
    name: 'Loira Canhota',
    url: 'https://www.youtube.com/channel/UCyAqigCbKd7bP3VmB0e5oiA',
  },
  {
    name: 'MagnusOfSpades',
    url: 'https://www.youtube.com/user/Magnum0fSpades',
  },
  {
    name: 'Pamelita Sobreiro',
    url: 'https://www.youtube.com/channel/UCX818ZgtgSbVKWPYTPxu6Sw/',
  },
]

// O comando de canais
class Canais extends DefaultCommand {
  constructor () {
    // Seta os nomes dos métodos de acordo com o idioma do servidor
    super({
      resume: {
        ptbr: 'Lista canais do YouTube com foco em Don\'t Starve',
        en: 'Lists YouTube channels focused on Don\'t Starve',
        es: 'Enumera los canales de YouTube centrados en Don\'t Starve',
        zhcn: '列出以“不要饿死”为中心的 YouTube 频道',
      },
      methods: {
        ptbr: {
          listar: {
            name: 'list', resume: 'Lista todos os canais de Youtube focados em Don\t Starve',
          },
        },
        en: {
          list: {
            name: 'list', resume: 'Lists all Youtube channels focused on Don\'t Starve',
          },
        },
        es: {
          lista: {
            name: 'list', resume: 'Lista todos os canais de Youtube focados em Don\'t Starve',
          },
        },
        zhcn: {
          清单: {
            name: 'list', resume: '列出所有关注“不要饿死”的Youtube频道',
          },
        },
      },
    })
  }

  // Método padrão quando nada for chamado
  main (_args, _message, _config) {
    this.list(_args, _message, _config)
  }

  // Método que lista os canais
  list (_args, _message, _config) {
    // Canais a serem listados
    const message = []

    // Adiciona canais formatados
    channels.map(i => {
      message.push(i.name)
      message.push(i.url)
      message.push(' ')
    })

    // Cria mensagem embutida
    const embed = new MessageEmbed()
      .setTitle('Canais de Don\'t Starve')
      .setDescription(message.join('\n'))

    // Envia mensagem embutida
    _message.channel.send(embed)
  }
}

module.exports = new Canais()