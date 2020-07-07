// Importa o token
const token = require('./token')

// Configurações do boot
const config = {
  token, // Token de acesso
  prefix: 'ds:', // Prefixo padrão
  Db: { // Conexão com o banco
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'dontstarveboot',
  },
}

module.exports = config