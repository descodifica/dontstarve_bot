// Importa classe padrão de comand
const DefaultCommand = require('./Default')

const ConfigEntity = require('../entities/Config')

// Comando de configurações
class Config extends DefaultCommand {
    main (_args, _message) {
        // Impede uso se não for por usuário do servidor
        if (!this.authorOwnerServerID(_message)) {
            _message.reply('Esse comando só pode ser usado pelo dono do servidor!')

            return
        }

        // Dados da atualização
        const data = {}
        data[_args[0]] = _args[1]

        // Atualiza e responde
        ConfigEntity.update(data, { server_id: this.serverId(_message), })
            .then(() => {
                _message.reply('Configuração atualizada com sucesso')
            })
            .catch(() => {
                _message.reply('Ocorreu algum problema ao atualizar a configuração')
            })
    }
}

module.exports = new Config()