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
}

module.exports = config