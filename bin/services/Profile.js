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
    })
  }
}

module.exports = new Profile()