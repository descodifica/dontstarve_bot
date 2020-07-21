// Importa o token
const token = require('../token')

// Configurações dobot
const config = {
  token, // Token de acesso
  prefix: 'ds:', // Prefixo padrão
  Db: { // Conexão com o banco
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'dontstarve_bot',
  },
  langs: [ // Idiomas contemplados pelo bot
    // 'bg', // Búlgaro
    // 'de', // Alemão
    'en', // Inglês
    'es', // Espanhol
    // 'fa', // Persa, Parsi, Farsi
    // 'fr', // Francês
    // 'hu', // 'Húngaro'
    // 'id', // Indonésio
    // 'it', // Italiano
    'ptbr', // Portgugês Brasil
    // 'ptpt', // Portgugês Portugal
    // 'nl', // Holandês
    // 'ro', // Romeno
    // 'ru', // Russo
    // 'sv', // Sueco
    // 'th', // Tailandês
    // 'tr', // Turco
    // 'ko', // Koreano
    'zhcn', // Chinês Simplificado
  ],
}

module.exports = config