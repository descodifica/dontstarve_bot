// Importa conexão com o banco
const Db = require('../Db')

// Classe de entidade padrão
class Default {
    constructor () {
        // Recebe o nome da entidade
        this.entity = this.constructor.name
    }

    /**
     * @name get
     * @description Retorna um registro
     * @param {String} _id Id do registro a ser recuperado
     * @returns {Object} O resultado
     */
    async get (_id) {
        return (await Db.query(`SELECT * FROM ${this.table} WHERE id = ${_id} LIMIT 1`))[0]
    }

    /**
     * @name create
     * @description Cria um novo registro
     * @param {Object} _data Dados a serem gravados
     * @returns {Object} O resultado
     */
    async create (_data) {
        // const columns = Object.keys(_data).join(', ')
        // const data = Object.values(_data).map(i => `'${i}'`).join(', ')

        // return (await Db.query(`SELECT * FROM ${this.table} WHERE id = ${_id} LIMIT 1`))[0]
    }
}

module.exports = Default