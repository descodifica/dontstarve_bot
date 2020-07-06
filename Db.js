// Importa conexão com o MySQL
const MySQL = require('promise-mysql')

// Importa configuração de conexão
const { Db: DbConfig, } = require('./config')

// Classe de conexão com o banco
class Db {
    // Coneta ao banco
    async connect () {
        this.Conn = await MySQL.createConnection(DbConfig)
    }

    /**
     * @name query
     * @description Executa um comando e retorna o resultado
     * @param {String} _query O comando sql
     * @returns {Object} O resultado
     */
    query (_query) {
        return this.Conn.query(_query)
    }
}

module.exports = new Db()