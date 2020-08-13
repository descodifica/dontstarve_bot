// Mensagem embutida
const { MessageEmbed, Emoji, } = require('discord.js')

// Verifica se uma variável contém um inteiro
const isArray = require('is-array')
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
   * @description Trata argumentos da mensagem
   * @returns {Array} Array contendo todos os argumentos
   */
  parserArgs () {
    // Recebe argumentos
    this.args = this.message.content

    // Pelo que trocar espaço dentro das aspas duplas
    const signal = '|_|'

    // Troca espaços entre aspas simples e duplas por |_|
    this.args = this.parserQuoteArgs(this.args, '\'', signal)
    this.args = this.parserQuoteArgs(this.args, '"', signal)

    this.args = this.args
      .slice(this.serverConfig.prefix.length) // Remove o prefixo
      .split(' ') // Separa pelo espaço
      .filter(i => i.trim() !== '') // Remove argumento em branco (espaço extra no comando)
      .map(i => i.split(signal).join(' ')) // Volta espaço das aspas

    // Separa comando e método
    this.command = this.originalCommand = this.args.shift()
    this.method = this.originalMethod = this.args.shift() || 'main'

    // Nome real do comando
    this.realCommand = Dictionary.getModuleName(
      this.serverConfig.lang, this.command
    )

    // Nome real do método
    this.realMethod = Dictionary.getMethodName(
      this.serverConfig.lang, this.realCommand, this.method
    )
  }

  /**
   * @description Retorna se a mensagem foi enviada para o Bot
   * @params {String} Prefixo do servidor
   * @returns {Boolean}
   */
  forBot (_prefix) {
    // Prefixo é o informado ou o presente em serverConfig
    const prefix = _prefix || (this.serverConfig || {}).prefix

    return (
      this.message.content.startsWith(prefix) && // Se começa com o prefixo e
      !this.fromBot() // Se não é mensagem de outro Bot
    )
  }

  /**
   * @description Retorna se a mensagem foi enviada por um Bot
   * @returns {Boolean}
   */
  fromBot () {
    return this.message.author.bot
  }

  /**
   * @description Retorna se existem argumentos
   * @returns {Boolean}
   */
  hasArgs () {
    return this.args.length > 0
  }

  /**
   * @description Retorna as mensões
   * @returns {Object}
   */
  mentions () {
    return this.message.mentions
  }

  /**
   * @description Retorna e mencionou alguém
   * @returns Boolean
   */
  hasMention () {
    return this.hasUserMention() || this.hasRoleMention()
  }

  /**
   * @description Retorna e mencionou alguma pessoa
   * @returns Boolean
   */
  hasUserMention () {
    return this.mentions().users.array().length > 0
  }

  /**
   * @description Retorna e mencionou algum cargo
   * @returns Boolean
   */
  hasRoleMention () {
    return this.mentions().roles.array().length > 0
  }

  /**
   * @description Retorna o ID do servidor
   * @returns {String}
   */
  serverId () {
    return (this.message.guild || {}).id
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
    * @description Retorna o ID do dono do servidor
    * @returns {String}
    */
  serverOwnerID () {
    return this.message.guild.ownerID
  }

  /**
    * @description Retorna se o autor da mensagem é dono do servidor
    * @returns {Boolean}
    */
  authorOwnerServer () {
    return this.authorId() === this.serverOwnerID()
  }

  /**
    * @description Retorna o avatar do autor da mensagem da mensagem
    * @returns {String}
    */
  authorAvatar (_message) {
    return this.message.author.displayAvatarURL()
  }

  /**
   * @description Envia uma mensagem embutida
   * @param {Object} _embedData Dados da mensagem embtida
   */
  async sendEmbedMessage (_embedData) {
    const embed = new MessageEmbed()

    if (_embedData.title) {
      embed.setTitle(_embedData.title)
    }

    if (_embedData.description) {
      embed.setDescription(_embedData.description)
    }

    if (_embedData.thumbnail) {
      embed.setThumbnail(_embedData.thumbnail)
    }

    return new Message(await this.message.channel.send(embed))
  }

  /**
   * @description Envia uma mensagem ao servidor de acordo com a tradução do dicionário
   * @param {String} _msg Id da mensagem
   * @param {String} _module Módulo da mensagem
   * @param {Object} _params Parâmetros extras da mensagem
   */
  sendFromDictionary (_module, _msg, _params = {}) {
    this.message.channel.send(this.getFromDictionary(_module, _msg, _params))
  }

  /**
   * @description Retorna uma mensagem ao servidor de acordo com a tradução do dicionário
   * @param {String} _msg Id da mensagem
   * @param {String} _module Módulo da mensagem
   * @param {Object} _params Parâmetros extras da mensagem
   * @returns {String}
   */
  getFromDictionary (_module, _msg, _params = {}) {
    return Dictionary.getMessage(
      this.serverConfig, _module, _msg, _params
    )
  }

  /**
   * @description Recebe um texto a ser enviado de acordo com a tradução do dicionário
   *                (concatena com o anterior)
   * @param {String} _msg Id da mensagem
   * @param {String} _module Módulo da mensagem
   * @param {Object} _params Parâmetros extras da mensagem
   * @param {Object} _config Configurações extras
   */
  setFromDictionary (_module, _msg, _params = {}, _config = {}) {
    this.set(Dictionary.getMessage(this.serverConfig, _module, _msg, _params), _config)
  }

  /**
   * @description Envia uma mensagem ao servidor (se não definir mensagem, usa recebida com get)
   * @param {String} _msg A mensagem
   * @returns {Promise}
   */
  send (_msg) {
    // Se tem mensagem no parâmetro, envia ela e finaliza
    if (_msg) {
      return this.message.channel.send(_msg)
    }

    // Tamanho máximo das mensagens permitido pelo Discord
    const maxLength = 2000

    // Promessas a serem resolvidas
    const promises = []

    // Percorre infinitamente até que seja interrompido no corpo
    while (true) {
      // Se a mensagem é maior que o permitido
      if (this.text.length > maxLength) {
        // Pega do início oq é permitido
        const msg2000 = this.text.slice(0, maxLength)

        // Encontra posição da última quebra de linha
        const pos = msg2000.lastIndexOf('\n')

        // Pega mensagem até a última quebra de linha dentro do máximo permitido
        const msgLastBreak = this.text.slice(0, pos)

        // Envia
        promises.push(this.message.channel.send(msgLastBreak))

        // Remove o conteúdo enviado damensagem da mensagem original
        this.text = this.text.slice(pos) + zeroWidthSpace + '\n'
      }
      else {
        // Envia resto da mensagem
        promises.push(this.message.channel.send(this.text))

        // Finaliza o laço
        break
      }
    }

    // Limpa mensagem em cache
    this.clean()

    // Retorna ultima promessa resolvida
    return Promise.all(promises).then(() => promises.pop())
  }

  /**
   * @description Envia uma mensagem interagivel
   * @params {String} A mensagem
   * @params {Object} As opções
   * @params {Function} A função a ser executado quando receber uma resposta
   * @returns {Object} A mensagem enviada
   */
  async sendPrompt ({ title, description = '', options, callback, }) {
    // Opções com os emojis corretos
    options = Emojis.exchangeKeys(options)

    // Emojis das reações
    const emojis = Object.keys(options)

    // Lista de opções formatadas
    const list = []

    // Percorre todas as opções e adiciona formatada a lista
    objectMap(options, (desc, emoji) => {
      list.push(`${emoji} ${desc}`)
    })

    // Envia mensagem
    const MessageSent = await this.sendEmbedMessage({
      title, description: description + '\n' + list.join('\n\n'),
    })

    // Adiciona reações a mensagem
    await MessageSent.react(emojis)

    // Filtro das reações
    const reactionFilter = { emojis, user: this.authorId(), }

    // Aguarda uma reação válida e executa o callback
    MessageSent.awaitReactions(reactionFilter).then(collected => {
      // Captura dados do emoji da reação
      const emoji = collected.first().emoji

      // Captura id (do bot) do emoji
      emoji._id = Emojis.getId(emoji.name)

      // Executa callback enviando dados do emoji da reação
      return callback(emoji)
    })

    // Retorna
    return MessageSent
  }

  /**
   * @description Retorna os argumentos com os espaços das aspas trocados
   * @param {Array} _args Os argumentos
   * @param {String} _quote As aspas usadas
   * @param {String} _signal O que por no lugar do espaço
   * @returns {Array} os argumentos com os espaços das aspas trocados
   */
  parserQuoteArgs (_args, _quote, _signal) {
    // Separa pelas aspas
    const args = _args.split(_quote)

    // Percorre todas as posições, começando pela primeira e pulando de 2 em em dois
    // Posição par é sempre com aspas
    for (let c = 1, max = args.length; c < max; c += 2) {
      // Troca espaço
      args[c] = args[c].split(' ').join(_signal)
    }

    // Une em string pelas aspas e retorna
    return args.join('')
  }

  /**
   * @description Recebe um texto a ser enviado (concatena com o anterior)
   * @param {String} _text O texto
   * @param {Object} _config Configurações extras
   */
  set (_text, _config = {}) {
    this.text += _text

    if (_config.breakLine) {
      this.break(_config.breakLine)
    }
  }

  /**
   * @description Recebe um texto a ser enviado (concatena com o anterior)
   * @param {String} _text O texto
   * @param {Object} _params Parâmetros extras
   */
  setExampleAndExplanation (_example, _explanation, _params = {}) {
    if (_params.breakTop) {
      this.break()
    }

    // Se explicação não for array, vira
    const explanation = (!isArray(_explanation) ? [ _explanation, ] : _explanation).map(e => {
      return `> *${e}*`
    }).join('\n> \n')

    this.text += `\`${_example}\`\n${explanation}`

    if (_params.breakBottom) {
      this.break(_params.breakBottom)
    }
  }

  /**
   * @description Recebe uma quebra de linha no texto a ser enviado
   * @params {Number} Tamanho da quebra
   */
  break (_length) {
    for (let c = 0; c < _length; c++) {
      this.text += zeroWidthSpace + '\n'
    }
  }

  /**
   * @description Limpa  o texto a ser enviado
   */
  clean () {
    this.text = ''
  }

  /**
   * @description Cria e retorna uma mensão
   * @params {String} _id o Id do usuário mensionado
   * @returns {String} A mensão
   */
  createMention (_id) {
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
    return this.awaitMessages({}, _params).then(response => response.first().content)
  }
}

// Exporta função que retorna um novo objeto de mensagem
module.exports = _message => new Message(_message)