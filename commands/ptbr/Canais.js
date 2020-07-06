const { MessageEmbed, } = require('discord.js')

const DefaultCommand = require('../Default')

const channels = [
    {
        name: 'BrunoSystem',
        url: 'https://www.youtube.com/channel/UCEah_poYjR9ow1xATcfhamA',
    },
    {
        name: 'Guia do Mochileiro do Constant',
        url: 'https://www.youtube.com/channel/UCZrAV0CNMklFtyxkwILzfdg/',
    },
    {
        name: 'Inception7',
        url: 'https://www.youtube.com/user/cabelofis',
    },
    {
        name: 'ᴊᴏɢᴀᴛɪɴᴀʟɪᴢᴀɴᴅᴏ',
        url: 'https://www.youtube.com/channel/UCTan1eeYiGlm6NhFktsPGiA',
    },
    {
        name: 'Loira Canhota',
        url: 'https://www.youtube.com/channel/UCyAqigCbKd7bP3VmB0e5oiA',
    },
    {
        name: 'MagnusOfSpades',
        url: 'https://www.youtube.com/user/Magnum0fSpades',
    },
    {
        name: 'Pamelita Sobreiro',
        url: 'https://www.youtube.com/channel/UCX818ZgtgSbVKWPYTPxu6Sw/',
    },
]

class Canais extends DefaultCommand {
    main (_args, _message) {
        this.listar(_args, _message)
    }

    listar (_args, _message) {
        const message = []

        channels.map(i => {
            message.push(i.name)
            message.push(i.url)
            message.push(' ')
        })

        const embed = new MessageEmbed()
            .setTitle('Canais de Don\'t Starve')
            .setDescription(message.join('\n'))

        _message.channel.send(embed)
    }
}

module.exports = new Canais()