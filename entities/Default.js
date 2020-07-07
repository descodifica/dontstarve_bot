// Mapea um objeto
const objectMap = require('object.map')

// Converte um JSON para clausula where do SQL
const jsonToSqlWhere = require('@desco/json-to-sql-where')

// Importa conexão com o banco
const Db = require('../Db')

// Classe de entidade padrão
class Default {
    constructor () {
        // Recebe o nome da entidade
        this.entity = this.constructor.name
    }

    /**
     * @description Retorna um registro dado um Id
     * @param {String} _id Id do registro a ser recuperado
     * @returns {Object} O resultado
     */
    async get (_id) {
        const result = await this.getBy({ id: _id, })

        return result[0]
    }

    /**
     * @description Retorna um registro dado um ou mais condições
     * @param {Object} _where Condições
     * @returns {Object} O resultado
     */
    async getBy (_where) {
        const result = await Db.query(`SELECT * FROM ${this.table} WHERE ${jsonToSqlWhere(_where)}`)

        return result
    }

    /**
     * @description Atualiza um novo registro
     * @param {Object} _data Dados a serem gravados
     * @param {Object} _where Condições para gravar
     * @returns {Object} O resultado
     */
    update (_data, _where) {
        const data = []
        const where = []

        // Monta treixo de atualização da SQL
        objectMap(_data, (v, k) => {
            // Se valor for string, adiciona aspas
            if (typeof v === 'string') {
                v = `"${v}"`
            }

            // Adiciona bem formatado ao array de registros
            data.push(`${k} = ${v}`)
        })

        // Monta treixo de condições da SQL
        objectMap(_where, (v, k) => {
            // Se valor for string, adiciona aspas
            if (typeof v === 'string') {
                v = `"${v}"`
            }

            // Adiciona bem formatado ao array de registros
            where.push(`${k} = ${v}`)
        })

        // Executa SQL de atualização e retorna o resultado
        return Db.query(`UPDATE ${this.table} SET ${data.join(', ')} WHERE ${where.join(' AND ')}`)
    }
}

module.exports = Default