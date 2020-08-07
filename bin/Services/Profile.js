const DefaultEntity = require('./Default')

// Entidade de configurações
class Profile extends DefaultEntity {
  constructor () {
    // Passa tipos das propriedades
    super({
      table: 'profiles',
      props: {
        birth: 'Date',
        genre: { type: 'Option', values: [ '0', '1', ], },
      },
      relations: {
        oneToMany: [ { entity: 'Experience', fk: 'user', }, ],
      },
    })
  }

  /**
   * @description Cria um perfil e seus relacionamentos
   * @param {Object} _data Dados a serem salvos
   * @param {Object} _serverConfig Configurações do servidor
   * @param {Boolean} _log Se deve exibir um log
   */
  create (_data, _serverConfig = {}, _log) {
    // Monta dados
    const data = {
      ..._data,
      Experience: [
        { user: _data.id, version: 'DS', },
        { user: _data.id, version: 'SW', },
        { user: _data.id, version: 'HAM', },
        { user: _data.id, version: 'DST', },
      ],
    }

    // Executa criação
    return super.create(data, _serverConfig, _log)
  }
}

module.exports = new Profile()