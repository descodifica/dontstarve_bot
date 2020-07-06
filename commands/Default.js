// Classe padrão dos comandos
class DefaultCommand {
    constructor () {
        // Recebe o nome do comando
        this.command = this.constructor.name
    }

    /**
     * @description Executa o comando
     * @param {String} _command Nome do comando
     * @param {Array[String]} Array com todos os argumentos
     * @param {Object} Objeto da mensagem
     */
    exec (_command, _args, _message) {
        this[_command](_args, _message)
    }

    /**
     * @description Retorna o ID do usuário
     * @param {Object} Objeto da mensagem
     * @returns {String} O ID
     */
    userId (_message) {
        return _message.author.id
    }

    /**
     * @description Retorna o ID do servidor
     * @param {Object} Objeto da mensagem
     * @returns {String} O ID
     */
    serverId (_message) {
        return _message.channel.guild.id
    }
}

module.exports = DefaultCommand