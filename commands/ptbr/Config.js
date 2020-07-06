// Importa classe padrão de comand
const DefaultCommand = require('../Default')

// Importa a entidade associada as configurações
const ConfigEntity = require('../../entities/Config')

// Comando de configurações
class Config extends DefaultCommand {
    async main (_args, _message) {
        // Recupera configurações do usuário
        const user = await ConfigEntity.get(this.userId(_message))
        console.log(typeof this.userId(_message), this.userId(_message))
        // Se não tem dados, cria
        if (!user) {
            await ConfigEntity.create({ id: this.userId(_message), })
        }
    }
}

module.exports = new Config()