// Mapea um objeto
const objectMap = require('object.map')

// Se uma variável é um objeto
const isObject = require('is-object')

// Converte um JSON para clausula where do SQL
const jsonToSqlWhere = require('@desco/json-to-sql-where')

// Importa conexão com o banco
const Db = require('../Db')
const isArray = require('is-array')

// Classe de entidade padrão
class Default {
  constructor ({ table, props = {}, relations = {}, }) {
    // Recebe o nome da entidade
    this.entity = this.constructor.name.toLowerCase()

    // Recebe nome da tabela
    this.table = table

    // Recebe propriedades
    this.props = objectMap(props, (i, k) => {
      if (typeof i === 'object') return i

      return { type: i, }
    })

    // Recebe relacionamentos
    this.relations = relations
  }

  /**
    * @description Retorna todos os registros
    * @param {Object} _params Parâmetros da listagem
    * @param {Boolean} _log Se deve imprimir o log
    * @returns {Object} O resultado
    */
  async list (_params = {}, _log) {
    const perPage = _params.perPage || 10
    const page = _params.page || 1

    const limit = perPage
    const offset = (page - 1) * perPage

    const sqlLimitOffset = `LIMIT ${limit} OFFSET ${offset}`
    const sqlWhere = _params.where ? `WHERE ${jsonToSqlWhere(_params.where)}` : ''
    const sql = `SELECT * FROM ${this.table} ${sqlWhere} ${sqlLimitOffset}`

    const result = await Db.query(sql, _log)
      .then(result => this.getRelations(result, _params.deep))
      .catch(e => {
        console.error({ code: e.code, sqlMessage: e.sqlMessage, sql: e.sql, })

        return Promise.reject(e)
      })

    return result
  }

  /**
    * @description Retorna um registro dado um Id
    * @param {String} _id Id do registro a ser recuperado
    * @param {Object} _params Parâmetros extras
    * @param {Boolean} _log Se deve imprimir o log
    * @returns {Object} O resultado
    */
  async get (_id, _params = {}, _log = false) {
    const result = await this.getBy({ id: _id, }, _params, _log)

    return result[0]
  }

  /**
    * @description Retorna um registro dado um ou mais condições
    * @param {Object} _where Condições
    * @param {Object} _params Parâmetros extras
    * @param {Boolean} _log Se deve imprimir o log
    * @returns {Object} O resultado
    */
  async getBy (_where = {}, _params = {}, _log = false) {
    return await this.list({ ..._params, where: _where, }, _log)
  }

  /**
    * @description Cria um novo registro
    * @param {Object} _data Dados a serem gravados
    * @param {Object} _serverConfig Configurações do servidor
    * @param {Boolean} _log Se deve imprimir o log
    * @returns {Object} O resultado
    */
  async create (_data, _serverConfig = {}, _log) {
    const columns = Object.keys(_data).join(', ')
    const values = Object.values(_data).map(i => typeof i === 'string' ? `"${i}"` : i).join(', ')

    // Executa SQL de criação
    const result = await Db.query(`INSERT INTO ${this.table} (${columns}) VALUES (${values})`, _log)

    // Busca e retorna registro criado
    return this.get(_data.id || result.insertId)
  }

  /**
    * @description Atualiza um registro
    * @param {Object} _data Dados a serem gravados
    * @param {Object} _where Condições para gravar
    * @param {String} _method Nome do método que possui os registros
    * @param {Object} _serverConfig Configurações do servidor
    * @param {Boolean} _log Se deve imprimir o log
    * @returns {Promise} Promessa resolvida
    */
  async update (_data, _where, _method, _serverConfig = {}, _log) {
    // Se não tem dados, finaliza
    if (Object.keys(_data).length === 0) return Promise.resolve()

    const data = []

    // Monta treixo de atualização da SQL
    objectMap(await this.formatData(_data, _method, _serverConfig), (v, k) => {
      // Se valor for string, adiciona aspas
      if (typeof v === 'string') {
        v = `"${v}"`
      }
      // Se valor for indefinido, vira NULL
      else if (v === undefined) {
        v = null
      }

      // Adiciona bem formatado ao array de registros
      data.push(`${k} = ${v}`)
    })

    // SQL de atualização
    const sql = `UPDATE ${this.table} SET ${data.join(', ')} WHERE ${jsonToSqlWhere(_where)}`

    // Executa SQL e retorna o resultado
    return Db.query(sql, _log)
      .catch(async e => Promise.reject(await this.treatMySqlError(e, _method, _serverConfig)))
  }

  /**
   * @description Formata os registros
   * @param {String} _record Os registros a serem formatados
   * @param {String} _method Nome do método que possui os registros
   * @param {Object} _serverConfig Configurações do servidor
   * @returns {Object} Registros formatados
   */
  formatData (_record, _method, _serverConfig = {}) {
    const record = {}
    const promises = []

    // Percorre todos os registros
    objectMap({ ..._record, }, (val, prop) => {
      // Se não consta na lista de propriedades, seta original
      if (!this.props[prop]) {
        record[prop] = val

        return
      }

      // Se for indefinido, seta string vazia
      if (val === undefined) {
        record[prop] = ''

        return
      }

      // Formata de acordo com o tipo
      switch (this.props[prop].type) {
        case 'Date': record[prop] = Dictionary.dateToEn(_serverConfig.lang, val)
          break
        case 'Relation': {
          promises.push(
            require('./Character').getBy({ name: val, }).then(r => {
              record[prop] = r.length > 0 ? r[0].id : -1
            })
          )
        }
          break
        default: record[prop] = val
      }
    })

    return Promise.all(promises).then(() => {
      return record
    })
  }

  /**
   * @description Trata um erro do MySql e retorna em padrão humano
   * @param {Error} _error O erro
   * @param {String} _error O método que invocou o erro
   * @param {Object} _serverConfig Configurações do servidor
   */
  async treatMySqlError (_error, _method, _serverConfig) {
    // Nome da propriedade que deu erro e o erro
    const { column: prop, type: typeError, } = this.getMySqlErrorType(_error)

    // Nome traduzido da propriedade que deu erro
    const translateProp = Dictionary.getTranslateMethodParam(
      _serverConfig.lang, this.entity, _method, prop
    )

    // Tipo da propriedade que deu erro
    const type = (this.props[prop] || {}).type || this.props[prop] || 'String'

    // Retorna o erro adequado

    if (type === 'Option' && typeError === 'WARN_DATA_TRUNCATED') {
      return {
        module: 'general',
        error: 'INVALID_OPTION',
        params: {
          prop: translateProp,
          options: this.props[prop].values.slice(0, -1).join(', '),
          lastOption: this.props[prop].values.slice(-1).toString(),
        },
      }
    }

    if (typeError === 'INCORRECT_DATE') {
      return { module: 'general', error: 'INVALID_DATE', params: { prop: translateProp, }, }
    }

    if (typeError === 'R_DATA_TOO_LONG') {
      return { module: 'general', error: 'LONG_TEXT', params: { prop: translateProp, }, }
    }

    if (typeError === 'INVALID_INTEGER') {
      return { module: 'general', error: 'INVALID_INTEGER', params: { prop: translateProp, }, }
    }

    if (typeError === 'INVALID_RELATION') {
      const Relation = require(`./${this.props[prop].entity}`)
      const options = (await Relation.list()).map(i => i.name)

      return {
        module: 'general',
        error: 'INVALID_RELATION',
        params: {
          prop: translateProp,
          options: options.slice(0, -1).join(', '),
          lastOption: options.slice(-1).toString(),
        },
      }
    }
  }

  /**
   * @description Retorna o tipo de erro do MySql e o nome da coluna que deu erro
   * @param {Error} _error O erro
   * @returns {String} O erro adequaddo
   */
  getMySqlErrorType (_error) {
    const error = _error.sqlMessage
    const errorCode = _error.code

    if (errorCode === 'WARN_DATA_TRUNCATED') {
      return {
        type: 'WARN_DATA_TRUNCATED',
        column: error.split(' ')[error.split(' ').indexOf('column') + 1].slice(1, -1),
      }
    }

    if (error.indexOf('Incorrect date value:') > -1) {
      return {
        type: 'INCORRECT_DATE',
        column: error.split(' ')[error.split(' ').indexOf('column') + 1].slice(1, -1),
      }
    }

    if (errorCode === 'R_DATA_TOO_LONG') {
      return {
        type: 'R_DATA_TOO_LONG',
        column: error.split(' ')[error.split(' ').indexOf('column') + 1].slice(1, -1),
      }
    }

    if (errorCode === 'R_DATA_TOO_LONG') {
      return {
        type: 'R_DATA_TOO_LONG',
        column: error.split(' ')[error.split(' ').indexOf('column') + 1].slice(1, -1),
      }
    }

    if (error.indexOf('Incorrect integer value') > -1) {
      return {
        type: 'INVALID_INTEGER',
        column: error.split(' ')[error.split(' ').indexOf('column') + 1].slice(1, -1),
      }
    }

    if (errorCode === 'ER_NO_REFERENCED_ROW_2') {
      return {
        type: 'INVALID_RELATION',
        column: error.split('(')[2].split(')')[0].slice(1, -1),
      }
    }
  }

  getRelations (_record, _deep = 0) {
    // Se profundidade for 0, finaliza e retorna original
    if (_deep === 0) return Promise.resolve(_record)

    // Array onde ficarão todas as promessas a serem concluidas antes de retornar
    const promises = []

    // Se é um único registro
    const unique = !isArray(_record)

    // Captura registro(s)
    const record = unique ? { ..._record, } : [ ..._record, ]

    // Captura profundidade menos 1 para controle
    const deep = _deep - 1

    // Se não for registro úmico
    if (!unique) {
      // Percorre todos os registros
      record.map((recordLine, k) => {
        // Eexecuta getRelations em cada um deles, adicinando a promessa ao array de promessas
        promises.push(
          this.getRelations(recordLine, _deep).then(result => {
            record[k] = result // Sobrescreve resultado na posição do array
          })
        )
      })
    }
    // Se for registro único
    else {
      // Percorre todos os tipos de relacionamentos
      objectMap(this.relations, (relations, type) => {
        relations.map(relation => {
          // Monta objeto de referencias do relacionamento
          const Relation = isObject(relation) ? { ...relation, } : { entity: relation, }

          // Importa objeto do relacionamento
          Relation.obj = require(`./${Relation.entity}`)

          // Seta FK e PK com valores passados ou padrões
          Relation.fk = Relation.fk || this.entity
          Relation.pk = Relation.pk || 'id'

          // A partir daqui, lógica muda de acordo com o tipo de relacionamento
          switch (type) {
            case 'oneToOne': {
              // Condições
              const where = {}

              // Seta condições
              where[Relation.fk] = _record[Relation.pk]

              // Executa a busca, adicionando promessa ao array de promesas
              promises.push(
                Relation.obj.getBy(where, deep).then(result => {
                  // Adiciona posição ao objeto
                  record[Relation.entity] = result
                })
              )
            }
              break
          }
        })
      })
    }

    return Promise.all(promises).then(() => {
      return record
    })
  }
}

module.exports = Default