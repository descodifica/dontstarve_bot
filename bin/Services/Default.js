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
    const { main: mainData, relations: relationData, } = this.separateRelation(_data)

    const columns = Object.keys(mainData).join(', ')
    const values = Object.values(mainData).map(i => typeof i === 'string' ? `"${i}"` : i).join(', ')

    // Executa SQL de criação
    const result = await Db.query(`INSERT INTO ${this.table} (${columns}) VALUES (${values})`, _log)

    // Id do registro criado
    const id = mainData.id || result.insertId

    // Cria relacionamentos e retorna registro criado
    return this.createRelations((await this.get(id)), relationData, _log)
  }

  /**
    * @description Atualiza um registro
    * @param {Object} _data Dados a serem gravados
    * @param {Object} _where Condições para gravar
    * @param {Boolean} _log Se deve imprimir o log
    * @returns {Promise} Promessa resolvida
    */
  async update (_data, _where, _log) {
    // Se não tem dados, finaliza
    if (Object.keys(_data).length === 0) return Promise.resolve()

    const data = []

    // Monta treixo de atualização da SQL
    objectMap(_data, (v, k) => {
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
  }

  /**
   * @description Atualiza uma dada propriedade
   * @params {String} _prop Nome da propriedade
   * @params {Object} _where Condições da atualização
   * @params {Object} _Message Mensagem enviada
   * @params {Object} _config Configurações do servidor
   * @params {Object} _messageParams Parâmetros das mensagens
   * @params {Boolean} _log Se deve exibir log
   */
  updateProp (_prop, _where, _Message, _config, _messageParams = {}, _log) {
    // Captura propriedade
    const prop = this.props[_prop] || {}

    // Se não tiver tipo, vira string
    const type = prop.type || 'String'

    // Método a ser usado de acordo com o tipo
    const method = 'updateProp' + type

    // Chama método de atualização equivalente
    return this[method](_prop, _where, _Message, _config, _messageParams, _log)
  }

  /**
   * @description Atualiza uma dada propriedade do tipo String
   * @params {String} _prop Nome da propriedade
   * @params {Object} _where Condições da atualização
   * @params {Object} _Message Mensagem enviada
   * @params {Object} _config Configurações do servidor
   * @params {Object} _messageParams Parâmetros das mensagens
   * @params {Boolean} _log Se deve exibir log
   */
  async updatePropString (_prop, _where, _Message, _config, _messageParams = {}, _log) {
    // Id básico do dicionário
    const basicDictionaryId = `${this.entity}.${_prop}`

    // Captura pergunta
    const ask = (
      Dictionary.get(basicDictionaryId + 'Resume', _config, _messageParams) +
      '\n' +
      Dictionary.get('general.informFreeField', _config, {}, { italic: true, })
    )

    // Pergunta e recebe  resposta
    const response = await _Message.ask(ask)

    // Dados a serem atualizados
    const data = {}

    // Insere dados no json
    data[_prop] = response.message.content

    // Atualiza e informa
    return this.update(data, _where, _log)
  }

  /**
   * @description Atualiza uma dada propriedade do tipo Number
   * @params {String} _prop Nome da propriedade
   * @params {Object} _where Condições da atualização
   * @params {Object} _Message Mensagem enviada
   * @params {Object} _config Configurações do servidor
   * @params {Object} _messageParams Parâmetros das mensagens
   * @params {Boolean} _log Se deve exibir log
   */
  async updatePropNumber (_prop, _where, _Message, _config, _messageParams = {}, _log) {
    // Id básico do dicionário
    const basicDictionaryId = `${this.entity}.${_prop}`

    // Captura pergunta
    const ask = (
      Dictionary.get(basicDictionaryId + 'Resume', _config, _messageParams) +
      '\n' +
      Dictionary.get('general.informNumberField', _config, {}, { italic: true, })
    )

    // Pergunta e recebe  resposta
    const response = await _Message.ask(ask)

    // Dados a serem atualizados
    const data = {}

    // Insere dados no json
    data[_prop] = parseFloat(response.message.content)

    // Atualiza e informa
    return this.update(data, _where, _log)
  }

  /**
   * @description Atualiza uma dada propriedade do tipo Date
   * @params {String} _prop Nome da propriedade
   * @params {Object} _where Condições da atualização
   * @params {Object} _Message Mensagem enviada
   * @params {Object} _config Configurações do servidor
   * @params {Object} _messageParams Parâmetros das mensagens
   * @params {Boolean} _log Se deve exibir log
   */
  async updatePropDate (_prop, _where, _Message, _config, _messageParams = {}, _log) {
    // Id básico do dicionário
    const basicDictionaryId = `${this.entity}.${_prop}`

    // Captura pergunta
    const ask = (
      Dictionary.get(basicDictionaryId + 'Resume', _config, _messageParams) +
      '\n' +
      Dictionary.get('general.infoDateField', _config, {}, { italic: true, })
    )

    // Pergunta e recebe  resposta
    const response = await _Message.ask(ask)

    // Dados a serem atualizados
    const data = {}

    // Insere dados no json
    data[_prop] = this.dateToEn(response.message.content, Dictionary.getDateFormat(_config.lang))

    // Atualiza e informa
    return this.update(data, _where, _log)
  }

  /**
   * @description Atualiza uma dada propriedade do tipo Option
   * @params {String} _prop Nome da propriedade
   * @params {Object} _where Condições da atualização
   * @params {Object} _Message Mensagem enviada
   * @params {Object} _config Configurações do servidor
   * @params {Object} _messageParams Parâmetros das mensagens
   * @params {Boolean} _log Se deve exibir log
   */
  async updatePropOption (_prop, _where, _Message, _config, _messageParams = {}, _log) {
    // Id básico do dicionário
    const basicDictionaryId = `${this.entity}.${_prop}`

    // Opções válidas
    const validOptions = (
      this.props[_prop].noTranslate
        ? this.props[_prop].values
        : this.props[_prop].values.map(v => {
          if (v.split('.').length === 1) {
            v = `${this.entity}.${v}`
          }

          return Dictionary.get(v, _config)
        })
    )

    // Captura pergunta
    const ask = (
      Dictionary.get(basicDictionaryId + 'Resume', _config, _messageParams) +
      '\n' +
      Dictionary.get(
        'general.infoOptionField',
        _config,
        {
          options: validOptions.slice(0, -1).map(i => `"${i}"`),
          lastOption: `"${validOptions.slice(-1)[0]}"`,
        },
        { italic: true, })
    )

    // Pergunta e recebe  resposta
    const response = await _Message.ask(ask)

    // Opção selecionada
    const selectedOption = validOptions.indexOf(response.message.content)

    // Se não deu uma resposta válida, informa e finaliza
    if (selectedOption === -1) {
      _Message.sendFromDictionary('general.optionNotValid', _config)

      return Promise.reject(new Error())
    }

    // Dados a serem atualizados
    const data = {}

    // Insere dados no json
    data[_prop] = selectedOption.toString()

    // Atualiza e informa
    return this.update(data, _where, _log)
  }

  /**
   * @description Atualiza uma dada propriedade do tipo Relation
   * @params {String} _prop Nome da propriedade
   * @params {Object} _where Condições da atualização
   * @params {Object} _Message Mensagem enviada
   * @params {Object} _config Configurações do servidor
   * @params {Object} _messageParams Parâmetros das mensagens
   * @params {Boolean} _log Se deve exibir log
   */
  async updatePropRelation (_prop, _where, _Message, _config, _messageParams = {}, _log) {
    // Id básico do dicionário
    const basicDictionaryId = `${this.entity}.${_prop}`

    // Personagens
    const characters = await require(`./${this.props[_prop].entity}`).list()

    // Opções válidas
    const validOptions = characters.map(i => i.name)
    // Captura pergunta
    const ask = (
      Dictionary.get(basicDictionaryId + 'Resume', _config, _messageParams) +
      '\n' +
      Dictionary.get(
        'general.infoRelationField',
        _config,
        {
          options: validOptions.slice(0, -1).map(i => `"${i}"`),
          lastOption: `"${validOptions.slice(-1)[0]}"`,
        },
        { italic: true, })
    )

    // Pergunta e recebe  resposta
    const response = await _Message.ask(ask)

    // Opção selecionada
    const selectedOption = (characters[validOptions.indexOf(response.message.content)] || {}).id

    // Se não deu uma resposta válida, informa e finaliza
    if (!selectedOption) {
      _Message.sendFromDictionary('general.optionNotValid', _config)

      return Promise.reject(new Error())
    }

    // Dados a serem atualizados
    const data = {}

    // Insere dados no json
    data[_prop] = selectedOption.toString()

    // Atualiza e informa
    return this.update(data, _where, _log)
  }

  /**
   * @description Efetua a busca dos relacionamentos e retorna o resultado
   * @param {Object} _record Resultados iniciais
   * @param {Number} _deep Profundidade atual
   */
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
          const Relation = this.createRelationDefs(relation)

          // Importa objeto do relacionamento
          Relation.obj = require(`./${Relation.entity}`)

          // Seta FK e PK com valores passados ou padrões
          Relation.fk = Relation.fk || this.entity
          Relation.pk = Relation.pk || 'id'

          // A partir daqui, lógica muda de acordo com o tipo de relacionamento
          switch (type) {
            case 'oneToMany': {
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

  /**
   * @description Recebe dados e separa eles entre principais e de relacionamentos
   * @param {Object} _data Dados
   * @reutrns {Object} Dados separados
   */
  separateRelation (_data) {
    // Onde ficarão os dados organizados
    const data = {
      main: {},
      relations: {
        oneToOne: [],
        oneToMany: [],
        belongsTo: [],
        manyToMany: [],
      },
    }

    // Percorre tipos relacionamentos
    objectMap(this.relations, (relations, type) => {
      // Percorre relacionamentos
      relations.map(relation => {
        // Se esse relacionamento consta nos dados
        if (_data[relation.entity]) {
          // Armazena corretamente
          data.relations[type][relation.entity] = _data[relation.entity]

          // Remove dos dados principais
          delete _data[relation.entity]
        }
      })
    })

    // Adiciona dados que restaram (principais) nos dados principais
    data.main = { ..._data, }

    // Retorna
    return data
  }

  /**
   * @description Cria relacionamentos e retorna registro completo
   * @param {Object} _data Dados principais
   * @param {Oject} _relationData Dados dos relacionamentos
   * @param {Boolean} _log Se deve exibir log
   */
  createRelations (_data, _relationData, _log) {
    // Lista de promessas que devem ser executadas antes de finalizar
    const promises = []

    // Dados
    const data = { ..._data, }

    // Percorre todos os tipos de relacionamentos
    objectMap(this.relations, (relations, type) => {
      // Percorre todos os relacionamentos
      relations.map(relation => {
        // Monta objeto de referencias do relacionamento
        const Relation = this.createRelationDefs(relation)

        // Dados dos relacionamentos
        const relationData = _relationData[type][relation.entity]

        // Se achou dados dos relacionamentos
        if (relationData) {
          // A partir daqui, muda dependendo do tipo de relacionamento
          switch (type) {
            case 'oneToMany': {
              // Cria posição nos dados principais
              data[Relation.entity] = data[Relation.entity] || []

              // Rercorre todos os dados de relacionamentos
              relationData.map(relation => {
                // Cria, armazena promessa em array e resultado nos dados principais
                promises.push(
                  Relation.obj.create(relation, _log).then(result => {
                    data[Relation.entity].push(result)
                  })
                )
              })
            }
          }
        }
      })
    })

    // Retorna apenas quando todas as promessas estiverem resolvidas
    return Promise.all(promises).then(() => data)
  }

  /**
   * @description Cria definições de relacionamento
   * @param {Object} _relation O relacionamento
   */
  createRelationDefs (_relation) {
    // Se não é objeto, vira
    const Relation = isObject(_relation) ? { ..._relation, } : { entity: _relation, }

    // Importa objeto da entidade relacionada
    Relation.obj = require(`./${Relation.entity}`)

    // Definie FK e PK ou seus padrões
    Relation.fk = Relation.fk || this.entity
    Relation.pk = Relation.pk || 'id'

    // Retorna
    return Relation
  }

  /**
   * @description Retorna a data informada no formato americano
   * @param {String} _date A data informada
   * @param {Object} _dateFormat Formato da data informada (de acordo com o idioma do bot)
   */
  dateToEn (_date, _dateFormat) {
    const splitDate = _date.split(_dateFormat.sep)

    const day = splitDate[_dateFormat.day]
    const month = splitDate[_dateFormat.month]
    const year = splitDate[_dateFormat.year]

    return [ year, month, day, ].join('-')
  }
}

module.exports = Default