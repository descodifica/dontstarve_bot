const { MessageEmbed, } = require('discord.js')

const DefaultCommand = require('../Default')

class Profile extends DefaultCommand {
    async main (_args, _message) {
        if (await (this.get({ user_id: this.authorId(_message), }))) {
            // this.view(_args, _message)
        }
        else {
            this.create(_args, _message)
        }
    }

    create (_args, _message) {
        this.add({ user_id: this.authorId(_message), })

        _message.reply('Perfil criado')
    }

    async view (_args, _message) {
        const data = await (this.get({ user_id: this.authorId(_message), }))

        const message = []

        message.push(`Idade: ${data.age || 'Não informado'}`)
        message.push(`Descrição: ${data.about || 'Não informado'}`)
        message.push(`Cidade: ${data.city || 'Não informado'}/${data.uf || 'Não informado'}`)
        message.push('')
        message.push('=== No Jogo ===')
        message.push('')
        message.push('Vanilla:')
        message.push('> Possui o jogo')
        message.push('> Sobreviveu por 0 dias')
        message.push('> É um Mochileiro: Já sobreviveu por pelo menos 1 ano e tem um conhecimento razoável do jogo')
        message.push('')
        message.push('ROG:')
        message.push('> Possui o jogo')
        message.push('> Sobreviveu por 0 dias')
        message.push('> É um Mochileiro: Já sobreviveu por pelo menos 1 ano e tem um conhecimento razoável do jogo')
        message.push('')
        message.push('Shipwrecked:')
        message.push('> Possui o jogo')
        message.push('> Sobreviveu por 0 dias')
        message.push('> É um Mochileiro: Já sobreviveu por pelo menos 1 ano e tem um conhecimento razoável do jogo')
        message.push('')
        message.push('Hamlet:')
        message.push('> Possui o jogo')
        message.push('> Sobreviveu por 0 dias')
        message.push('> É um Mochileiro: Já sobreviveu por pelo menos 1 ano e tem um conhecimento razoável do jogo')
        message.push('')
        message.push('Together:')
        message.push('> Possui o jogo')
        message.push('> Sobreviveu por 0 dias')
        message.push('> É um Mochileiro: Já sobreviveu por pelo menos 1 ano e tem um conhecimento razoável do jogo')
        message.push('')
        message.push('ROG Mobile:')
        message.push('> Possui o jogo')
        message.push('> Sobreviveu por 0 dias')
        message.push('> É um Mochileiro: Já sobreviveu por pelo menos 1 ano e tem um conhecimento razoável do jogo')
        message.push('')
        message.push('Shipwrecked Mobile:')
        message.push('> Possui o jogo')
        message.push('> Sobreviveu por 0 dias')
        message.push('> É um Mochileiro: Já sobreviveu por pelo menos 1 ano e tem um conhecimento razoável do jogo')

        const embed = new MessageEmbed()
            .setTitle('Perfil de ' + _message.author.username)
            .setDescription(message.join('\n'))

        _message.channel.send(embed)
    }
}

module.exports = new Profile()