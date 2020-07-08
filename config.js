// Importa o token
const token = require('./token')

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
  langs: [ 'ptbr', 'en', ], // Idiomas contemplados pelo bot
}

module.exports = config