// Mensagem embutida
const { MessageEmbed, } = require('discord.js')

// Verifica se uma variável contém um inteiro
const isArray = require('is-array')

// Faz um laço em um objeto
const objectMap = require('object.map')

// Caracter invisivel
const zeroWidthSpace = '​'

/**
 * @description Classe das mensagens
 */
class Message {
  /**
   * @params {Object} _message Objeto padrão de mensagem do Dicord.js
   */
  constructor (_message) {
    this.message = _message
    this.text = ''
  }

  /**
    * @description Retorna o autor da mensagem
    * @returns {String}
    */
  author () {
    return this.message.author
  }

  /**
    * @description Retorna o ID do autor da mensagem
    * @returns {String}
    */
  authorId () {
    return this.message.author.id
  }

  /**
    * @description Retorna o nome do autor da mensagem
    * @returns {String}
    */
  authorUserName () {
    return this.message.author.username
  }

  /**
    * @description Retorna o avatar do autor da mensagem da mensagem
    * @returns {String}
    */
  authorAvatar (_message) {
    return this.message.author.displayAvatarURL()
  }

  /**
    * @description Retorna se o autor da mensagem é dono do servidor
    * @returns {Boolean}
    */
  authorOwnerServer () {
    return this.authorId() === this.serverOwnerID()
  }

  /**
   * @description Retorna o ID do servidor
   * @returns {String}
   */
  serverId () {
    return (this.message.guild || {}).id
  }

  /**
    * @description Retorna o ID do dono do servidor
    * @returns {String}
    */
  serverOwnerID () {
    return this.message.guild.ownerID
  }

  /**
   * @description Retorna os dados do servidor
   * @returns {Object}
   */
  server () {
    return this.message.channel.guild
  }

  /**
   * @description Retorna os membros do servidor
   * @returns {Object}
   */
  serverMembers () {
    return this.server().members.cache
  }

  /**
   * @description Retorna se a mensagem foi enviada para o Bot
   * @params {Object} Dados do bot
   * @returns {Boolean}
   */
  forBot (_bot) {
    return this.mentions().has(_bot)
  }

  /**
   * @description Retorna se a mensagem foi enviada por um Bot
   * @returns {Boolean}
   */
  fromBot () {
    return this.message.author.bot
  }

  /**
   * @description Retorna as mensões
   * @returns {Object}
   */
  mentions () {
    return this.message.mentions
  }

  /**
   * @description Retorna se mencionou alguém
   * @returns Boolean
   */
  hasMention () {
    return this.hasAnyUserMention() || this.hasAnyRoleMention()
  }

  /**
   * @description Retorna se mencionou alguma pessoa
   * @returns Boolean
   */
  hasAnyUserMention () {
    return this.mentions().users.array().length > 0
  }

  /**
   * @description Retorna se mencionou algum cargo
   * @returns Boolean
   */
  hasAnyRoleMention () {
    return this.mentions().roles.array().length > 0
  }

  /**
   * @description Envia uma mensagem para o canal
   * @returns {Object} A mensagem enviada
   */
  send (_msg) {
    return this.message.channel.send(_msg)
  }

  /**
   * @description Envia uma mensagem para o canal a partir do dicionário
   * @params {String} _id Id da mensagem no dicionário
   * @params {Object} _config Configurações do servidor
   * @params {Object} _params Parâmetros da mensagem
   * @returns {Object} A mensagem enviada
   */
  sendFromDictionary (_id, _config, _params) {
    return this.send(
      Dictionary.get(_id, _config, _params)
    )
  }

  /**
   * @description Envia uma mensagem embutida
   * @param {Object} _embedData Dados da mensagem embtida
   */
  async sendEmbedMessage (_embedData) {
    const embed = new MessageEmbed()

    // Se opções estiver em array, vira objeto
    _embedData.fields = isArray(_embedData.fields)
      ? { main: _embedData.fields, }
      : _embedData.fields

    if (_embedData.title) {
      embed.setTitle(_embedData.title)
    }

    if (_embedData.description) {
      embed.setDescription(_embedData.description)
    }

    if (_embedData.fields) {
      objectMap(_embedData.fields, (fields, fieldsTitle) => {
        if (fieldsTitle !== 'main') {
          embed.addFields({ name: '> ' + fieldsTitle, value: zeroWidthSpace, })
          console.log(fieldsTitle)
        }

        fields.map(field => {
          field.name = field.name || zeroWidthSpace
          field.value = field.value || zeroWidthSpace

          embed.addFields(field)
        })
      })
    }

    if (_embedData.thumbnail) {
      embed.setThumbnail(_embedData.thumbnail)
    }

    return new Message(await this.message.channel.send(embed))
  }

  /**
   * @description Envia uma mensagem interagivel
   * @params {String} _data Dados
   * @params {Object} _config Configurações do bot
   * @params {Function} A função a ser executado quando receber uma resposta
   */
  async sendPrompt (_data, _config) {
    // Recebe dados
    const data = { ..._data, }

    // Opções
    const optionsList = {}

    // Se opções estiver em array, vira objeto
    data.options = isArray(data.options) ? { main: data.options, } : data.options

    data.description = data.description || ''

    // Formata opções
    data.options = objectMap(data.options, (options, optionsName) => {
      // Se passou nome do grupo diferente de main, exibe o nome
      if (optionsName !== 'main') {
        const name = Dictionary.get(optionsName, _config)

        data.description += `\n\n> **${name}**`
      }

      return options.map(option => {
        option.icon = Emojis.get(option.icon)

        optionsList[option.icon] = option.callback

        data.description += (
          `\n\n${option.icon} **${option.name}**` +
          `\n${option.value || ''}`
        )

        return option
      })
    })

    // Envia mensagem
    const MessageSent = await this.sendEmbedMessage({
      title: data.title,
      description: data.description,
      // fields: data.options,
      thumbnail: data.thumbnail,
    })

    // Os emojis das opções
    const emojis = Object.keys(optionsList)

    // Adiciona reações a mensagem
    await MessageSent.react(emojis)

    // Filtro das reações
    const reactionFilter = { emojis, user: this.authorId(), }

    // Aguarda uma reação válida e executa o callback
    return MessageSent.awaitReactions(reactionFilter)
      .then(collected => {
        // Captura dados do emoji da reação
        const emoji = collected.first().emoji

        // Executa o callback
        optionsList[emoji]()

        // Remove mensagem reagida
        MessageSent.message.delete()
      })
      .catch(e => {
        // Remove mensagem
        MessageSent.message.edit(
          new MessageEmbed()
            .setTitle(Dictionary.get('general.timeoutTitle', _config))
            .setDescription(Dictionary.get('general.timeoutContent', _config))
        )
      })
  }

  /**
   * @description Cria e retorna uma mensão
   * @params {String} _id o Id do usuário mensionado
   * @returns {String} A mensão
   */
  mention (_id) {
    return `<@${_id}>`
  }

  /**
   * @description Reage a mensagem
   * @param {Array|String} _reactions As reações
   */
  async react (_reactions = []) {
    // Se não é array, vira
    const reactions = isArray(_reactions) ? [ ..._reactions, ] : [ _reactions, ]

    // Se não tem reações, ignora
    if (reactions.length === 0) return Promise.resolve()

    // Captura primeira reação
    const reaction = reactions.shift()

    // Reage
    await this.message.react(reaction)

    // Próximas reações (recursividade)
    this.react(reactions)
  }

  /**
   * @description Aguarda reações
   * @params {Function} _filter
   * @params {Object} _params
   * @returns Promise
  */
  awaitReactions (_filter = () => true, _params = {}) {
    return this.await('Reactions', _filter, _params)
  }

  /**
   * @description Aguarda mensagens
   * @params {Function} _filter
   * @params {Object} _params
   * @returns Promise
  */
  awaitMessages (_filter = () => true, _params = {}) {
    return this.await('Messages', _filter, _params)
  }

  /**
   * @description Aguarda algo
   * @params {Function} _filter
   * @params {Object} _params
   * @returns Promise
  */
  await (_type, _filter = () => true, _params = {}) {
    // Parâmetros padrões
    const params = { time: 60000, max: 1, ..._params, }

    // Filtro
    const filter = typeof _filter === 'function' ? _filter : (reaction, user) => {
      // Se validação de usuário é valida
      let userOK = true

      // Se validação de emoji é valida
      let emojisOK = true

      // Se passou filtro de usuário, adiciona resultado da condição ao userOK
      if (_filter.user) {
        userOK = user.id === _filter.user
      }

      // Se passou filtro de emoji, adiciona resultado da condição emojiOK
      if (_filter.emojis) {
        emojisOK = _filter.emojis.indexOf(reaction.emoji.name) > -1
      }

      // Retorna resultado
      return userOK && emojisOK
    }

    if (_type === 'Reactions') {
      return this.message.awaitReactions(filter, params)
    }
    else if (_type === 'Messages') {
      return this.message.channel.awaitMessages(filter, params)
    }
  }

  /**
   * @description Envia uma pergunta e executa um callback ao receber a resposta
   * @params {String} _ask A pergunta
   * @params {Object} _params Parâmetros extras
   * @returns Promise
  */
  async ask (_ask, _params = {}) {
    // Envia pergunta
    await this.send(_ask)

    // Aguarda resposta e retorna
    return this.awaitMessages({}, _params).then(response => new Message(response.first()))
  }
}

// Exporta função que retorna um novo objeto de mensagem
module.exports = _message => new Message(_message)