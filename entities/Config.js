const DefaultEntity = require('./Default')

// Entidade de configurações
class Config extends DefaultEntity {
    constructor () {
        super()

        this.table = 'configs'
    }
}

module.exports = new Config()