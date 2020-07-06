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
     * @description Retorna o ID do autor da mensagem
     * @param {Object} Objeto da mensagem
     * @returns {String} O ID
     */
    authorId (_message) {
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

    /**
     * @description Retorna o ID do dono do servidor
     * @param {Object} Objeto da mensagem
     * @returns {String} O ID
     */
    serverOwnerID (_message) {
        return _message.guild.ownerID
    }

    /**
     * @description Retorna se o autor da mensagem é dono do servidor
     * @param {Object} Objeto da mensagem
     * @returns {Boolean}} Se é dono
     */
    authorOwnerServerID (_message) {
        return this.authorId(_message) === this.serverOwnerID(_message)
    }
}

module.exports = DefaultCommand