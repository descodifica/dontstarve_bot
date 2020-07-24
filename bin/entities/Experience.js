const DefaultEntity = require('./Default')

// Entidade de experiências
class Experience extends DefaultEntity {
  constructor () {
    super()

    this.table = 'experiences'
  }
}

module.exports = new Experience()