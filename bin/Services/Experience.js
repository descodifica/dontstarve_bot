const DefaultEntity = require('./Default')

// Entidade de experiências
class Experience extends DefaultEntity {
  constructor () {
    super({
      table: 'experiences',
      props: {
        have: { type: 'Option', values: [ 'general.no', 'general.yes', ], },
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
            'abductedName', 'hungryName', 'explorerName', 'survivorName', 'backpackerName',
            'constantianName', 'charliesFriendName', 'kingOfConstantName', 'allyOfThemName',
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