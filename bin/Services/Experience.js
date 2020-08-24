const DefaultEntity = require('./Default')

// Entidade de experiências
class Experience extends DefaultEntity {
  constructor () {
    super({
      table: 'experiences',
      props: {
        have: { type: 'Boolean', },
        platform: {
          type: 'Option',
          noTranslate: true,
          values: [ 'Steam', 'PS', 'Xbox', 'Android', 'Iphone', ],
        },
        hours: { type: 'Number', },
        survived: { type: 'Number', },
        main: { type: 'Relation', entity: 'Character', },
        level: {
          type: 'Option',
          values: [
            'abducted', 'hungry', 'explorer', 'survivor', 'backpacker', 'constantian',
            'charliesFriend', 'kingOfConstant', 'allyOfThem',
          ],
        },
      },
      relations: {
        belongsTo: [ 'Character', 'Profile', ],
      },
    })
  }
}

module.exports = new Experience()