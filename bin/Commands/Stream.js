// Percorre todos os campos de um json
const objectMap = require('object.map')

// Importa comando padrão
const DefaultCommand = require('./Default')

// Lista de links de canais
const list = {
  BrunoSystem: {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a/AATXAJxd92_lWf6OWjNZkFh0QmG0hukzUIqg_3ocWlvK=s100-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Dicas de Don\'t Starve,  Plants vs Zombies, Clash Royale, Stardew Valley, ' +
      'Terraria e etc.',
    url: 'https://www.youtube.com/BrunoSystem',
  },
  FearTime: {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a/AATXAJxVkvkZDsaCqTsiEuNizCXwOdMSTtZTnWPnh2gfbQ=s100-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Canal focado em jogos, indies (e umas exeções), roguelikes e Don\'T Starve (' +
        'que faz parte das duas primeiras categorias).',
    url: 'https://www.youtube.com/c/FearTime/',
  },
  'Guia do Mochileiro do Constant': {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a-/AOh14GgvYxd8zBP81fPCpDYskQ7jlCRC75M5Q1a8mDQZkQ=s88-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Canal 100% dedicado ao jogo de sobrevivência Don\'t Starve, com GamePlays, ' +
      'dicas, tutoriais, teorias, histórias e etc',
    url: 'https://www.youtube.com/GuiaDoMochileiroDoConstant',
  },
  Inception7: {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a/AATXAJwrjY5YiyA6Ce3Vx_EY3CWw-xbB1uzaSnyazMKi=s100-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Games!',
    url: 'https://www.youtube.com/Inception7',
  },
  ᴊᴏɢᴀᴛɪɴᴀʟɪᴢᴀɴᴅᴏ: {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a/AATXAJyoJOXXHAV5q_gpCm4Bdny7NaMp_aKXpYF9SiOF4w=s100-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Eu faço videos de Don\'t Starve e também de outros jogos.\n\nBuUu...',
    url: 'https://www.youtube.com/JOGATINALIZANDO',
  },
  'Loira Canhota': {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a/AATXAJxTlwvCTIjDZMaGFZQILNA8sa04F1DSvdbt75qFCg=s100-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Uma simples loira canhota que te passa as dicas mais legais para jogos, te ' +
      'conta algumas teorias e te explica a história sobre vários personagens do mundo dos games.' +
      '\n\nSeja bem-vindo e aproveite os vídeos =)',
    url: 'https://www.youtube.com/c/PressStartloiracanhota',
  },
  Magnum0fSpades: {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a/AATXAJymWkiFou2mw4G4l96qW0YrF4V4b965Z4wRqjOT=s100-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Grande Galera! Magnum com vocês e um prazer tê-los aqui. Se você quer aprender ' +
      'mais sobre Don\'t Starve e outros jogos espero poder ajudar. Live todos os Domingos as 21 ' +
      'Horas! ',
    url: 'https://www.youtube.com/c/Magnum0fSpadesOficial',
  },
  'Pamelita Sobreiro': {
    type: 'Youtube',
    avatar: 'https://yt3.ggpht.com/a/AATXAJwu1D6SYq9yxdj3FKq1CuWPmDa9GUkVvBe_tXfdRw=s100-c-k-' +
      'c0xffffffff-no-rj-mo',
    description: 'Procurando conteúdo sobre jogos Asa de Cristal e Don\'t Starve?\n\n' +
      'Aqui você terá acesso a gameplays e tutorias não só sobre estes jogos mas também sobre ' +
      'outros. Vivencie o mundo dos mods, e tenha novas experiencias. Eu espero você nessa ' +
      'jornada :D',
    url: 'https://www.youtube.com/PinBallGames',
  },
}

// O comando dos Streamers
class Stream extends DefaultCommand {
  /**
   * @description Principal
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_Message, _config) {
    this.list(_Message, _config)
  }

  /**
   * @description Lista todos
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  list (_Message, _config) {
    objectMap(list, (v, k) => {
      _Message.sendEmbedMessage({
        title: k,
        description: v.description + '\n\n__*' + v.url + '*__',
        thumbnail: v.avatar,
      })
    })
  }
}

module.exports = new Stream()