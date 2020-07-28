const DefaultEntity = require('./Default')

// Entidade de configurações
class Profile extends DefaultEntity {
  constructor () {
    // Passa tipos das propriedades
    super({
      table: 'profiles',
      props: {
        birth: 'Date',
      },
    })
  }
}

module.exports = new Profile()