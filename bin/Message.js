// Mensagem embutida
const { MessageEmbed, } = require('discord.js')

// Verifica se uma variável contém um inteiro
const isArray = require('is-array')

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
   * @description Retorna o ID do servidor
   * @returns {String}
   */
  serverId () {
    return (this.message.guild || {}).id
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
  sendEmbedMessage (_embedData) {
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

    this.message.channel.send(embed)
  }

  /**
   * @description Envia uma mensagem ao servidor de acordo com a tradução do dicionário
   * @param {String} _msg Id da mensagem
   * @param {String} _module Módulo da mensagem
   * @param {Object} _params Parâmetros extras da mensagem
   */
  sendFromDictionary (_module, _msg, _params = {}) {
    this.message.channel.send(
      Dictionary.getMessage(
        this.serverConfig, _module, _msg, _params
      )
    )
  }

  /**
   * @description Recebe um texto a ser enviado de acordo com a tradução do dicionário
   *                (concatena com o anterior)
   * @param {String} _msg Id da mensagem
   * @param {String} _module Módulo da mensagem
   * @param {Object} _params Parâmetros extras da mensagem
   */
  setFromDictionary (_module, _msg, _params = {}) {
    this.set(Dictionary.getMessage(this.serverConfig, _module, _msg, _params))
  }

  /**
   * @description Envia uma mensagem ao servidor (se não definir mensagem, usa recebida com get)
   * @param {String} _msg A mensagem
   */
  send (_msg) {
    // Se tem mensagem no parâmetro, envia ela
    if (_msg) {
      this.message.channel.send(_msg)
    }

    // Tamanho máximo das mensagens permitido pelo Discord
    const maxLength = 2000

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
        this.message.channel.send(msgLastBreak)

        // Remove o conteúdo enviado damensagem da mensagem original
        this.text = this.text.slice(pos) + zeroWidthSpace + '\n'
      }
      else {
        // Envia resto da mensagem
        this.message.channel.send(this.text)

        // Finaliza o laço
        break
      }
    }

    this.clean()
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
   */
  set (_text) {
    this.text += _text
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
      this.text += '\n'
    }
  }

  /**
   * @description Limpa  o texto a ser enviado
   */
  clean () {
    this.text = ''
  }
}

// Exporta função que retorna um novo objeto de mensagem
module.exports = _message => new Message(_message)