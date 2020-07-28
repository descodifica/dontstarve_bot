const DefaultEntity = require('./Default')

// Entidade de experiências
class Experience extends DefaultEntity {
  constructor () {
    super({
      table: 'experiences',
      props: {
        platform: { type: 'Option', values: [ 'Steam', 'PS', 'Xbox', 'Android', 'Iphone', ], },
        main: { type: 'Relation', entity: 'Character', },
      },
    })
  }
}

module.exports = new Experience()