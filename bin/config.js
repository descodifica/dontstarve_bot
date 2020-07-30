// Importa o token
const token = require('../token')

// Configurações dobot
const config = {
  token, // Token de acesso
  Db: { // Conexão com o banco
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'dontstarve_bot',
  },
  langs: [ // Idiomas contemplados pelo Bot
    'ptbr', // Portgugês Brasil
    'en', // Inglês
    // 'es', // Espanhol
    // 'zhcn', // Chinês Simplificado
    // 'it', // Italiano
    // 'fr', // Francês
    // 'de', // Alemão
    // 'bg', // Búlgaro
    // 'fa', // Persa, Parsi, Farsi
    // 'hu', // 'Húngaro'
    // 'id', // Indonésio
    // 'ptpt', // Portgugês Portugal
    // 'nl', // Holandês
    // 'ro', // Romeno
    // 'ru', // Russo
    // 'sv', // Sueco
    // 'th', // Tailandês
    // 'tr', // Turco
    // 'ko', // Koreano
  ],
}

module.exports = config