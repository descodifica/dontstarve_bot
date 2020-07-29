const DefaultEntity = require('./Default')

// Entidade de experiências
class Experience extends DefaultEntity {
  constructor () {
    super({
      table: 'experiences',
      props: {
        platform: { type: 'Option', values: [ 'Steam', 'PS', 'Xbox', 'Android', 'Iphone', ], },
        main: { type: 'Relation', entity: 'Character', },
        rank: { type: 'Option', values: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, ], },
      },
    })
  }
}

module.exports = new Experience()