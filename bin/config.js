// Importa o token
const token = require('../token')

// Configurações dob ot
const config = {
  token, // Token de acesso
  environment: process.env.NODE_ENV || 'development', // Se esta em produção ou desenvolvimento
  Db: { // Conexão com o banco (desenvolvimento)
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'dontstarve_bot',
  },
}

// Se estiver em produção, usa configurações de banco em produção
if (config.environment === 'production') {
  config.Db = require('./bin/dbProduction')
}

module.exports = config