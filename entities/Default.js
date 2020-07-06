// Mapea um objeto
const objectMap = require('object.map')

// Importa conexão com o banco
const Db = require('../Db')

// Classe de entidade padrão
class Default {
    constructor () {
        // Recebe o nome da entidade
        this.entity = this.constructor.name
    }

    /**
     * @description Retorna um registro
     * @param {String} _id Id do registro a ser recuperado
     * @returns {Object} O resultado
     */
    async get (_id) {
        return (await Db.query(`SELECT * FROM ${this.table} WHERE id = ${_id} LIMIT 1`))[0]
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
        const sql = `UPDATE ${this.table} SET ${data.join(', ')} WHERE ${where.join(' AND ')}`
        console.log(sql)
        return Db.query(sql)
    }
}

module.exports = Default