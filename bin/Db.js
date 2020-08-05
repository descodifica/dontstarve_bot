// Importa conexão com o MySQL
const MySQL = require('promise-mysql')

// Importa configuração de conexão
const { Db: DbConfig, } = require('./config')

// Classe de conexão com o banco
class Db {
  /**
   * @description Coneta ao banco
   */
  async connect () {
    // Se não ta conectado, conecta
    if (!this.connected()) {
      this.Conn = await MySQL.createPool(DbConfig)
    }
  }

  /**
   * @description Verifica se esta conectado
   * @returns {Boolean}
   */
  connected () {
    const connected = !!this.Conn && !this.Conn.pool._closed

    return connected
  }

  /**
     * @name query
     * @description Executa um comando e retorna o resultado
     * @param {String} _query O comando sql
     * @param {Bolean} _log Se deve exibir um log no console
     * @returns {Object} O resultado
     */
  async query (_query, _log = false) {
    if (_log) console.log(_query)

    // Conecta ao banco
    await this.connect()

    // Executa e retorna
    return this.Conn.query(_query)
  }
}

module.exports = new Db()