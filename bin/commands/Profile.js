// TODO: Adicionar mods

// Percorre todos os campos de um json
const objectMap = require('object.map')

// Filtra objetos
const objectFilter = require('object-filter')

// Calcula idade
const { AgeFromDate, } = require('age-calculator')

// Serviços
const ProfileService = require('../entities/Profile')
const ExperienceService = require('../entities/Experience')
const CharacterService = require('../entities/Character')

// Importa comando padrão
const DefaultCommand = require('./Default')

// O comando de Perfil
class Profile extends DefaultCommand {
  /**
   * @description Visualiza um perfil
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _message, _config) {
    this.view(_args, _message, _config)
  }

  /**
   * @description Visualiza um perfil
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async view (_args, _message, _config) {
    // Se pediu perfil de alguém
    const ifMention = _args.length > 0

    // Id do perfil
    const profileId = !ifMention ? this.authorId(_message) : _args[0].id

    // Nome do perfil
    const profileName = !ifMention ? this.authorUserName(_message) : _args[0].username

    // Avatar do perfil
    const profileAvatar = !ifMention ? this.authorAvatar(_message) : _args[0].displayAvatarURL()

    // Busca o perfil
    let profile = await ProfileService.get(profileId)

    // Se não achou e não tem menção, cria, informa e busca novamente
    // Se tem mensão, informa apenas
    if (!profile) {
      if (!ifMention) {
        await ProfileService.create({ id: profileId, })

        _message.reply(
          Dictionary.getMessage(_config.lang, 'profile', 'CREATE', { prefix: _config.prefix, })
        )

        profile = await ProfileService.get(profileId)
      }
      else {
        _message.reply(
          Dictionary.getMessage(_config.lang, 'profile', 'NO_PROFILE', { user: profileName, })
        )

        return
      }
    }

    // Adiciona posição de experiências
    profile.experiences = {}

    // Versões do jogo
    const versions = [
      [ 'DS', 'Solo', ], [ 'SW', 'Shipwrecked', ], [ 'HAM', 'Hamlet', ], [ 'DST', 'Together', ],
    ]

    // Busca experiências
    const experiences = await ExperienceService.getBy({ user: profileId, })

    // Organiza experiências por versão do jogo
    experiences.map(data => profile.experiences[data.version] = data)

    // Experiencias não encontradas viram objeto vazio
    versions.map(([ initials, ]) => {
      profile.experiences[initials] = profile.experiences[initials] || {}
    })

    // Armazena promessas para que possa aguardar todas concluidas
    const pendingPromises = []

    // Formata informações das experiências
    objectMap(profile.experiences, (version, k) => {
      objectMap(profile.experiences[k], (v, prop) => {
        switch (prop) {
          case 'level': {
            let id

            switch (v) {
              case '9': id = 'ABDUCTED'
                break
              case '8': id = 'HUNGRY'
                break
              case '7': id = 'EXPLORER'
                break
              case '6': id = 'SURVIVOR'
                break
              case '5': id = 'BACKPACKER'
                break
              case '4': id = 'CONSTANTIAN'
                break
              case '3': id = 'CHARLIES_FRIEND'
                break
              case '2': id = 'KING_OF_CONSTANT'
                break
              case '1': id = 'ALLY_OF_THEM'
            }

            profile.experiences[k][prop] = `[ ${v} ] ` + Dictionary.getMessage(
              _config.lang, 'profile', id + '_TEXT'
            )
          }
            break
          case 'main': {
            // Busca personagem
            const promise = CharacterService.get(v)

            // Executa promessa e formata
            promise.then(data => profile.experiences[k][prop] = data.name)

            // Adiciona promessa na lista para que aguarde
            pendingPromises.push(promise)
          }
        }
      })
    })

    // Aguarda a finalização de todas as promessas
    await Promise.all(pendingPromises)

    // Função de tratamento de não informado
    const getValOrNotDefined = (_val, _c = v => v) => {
      return _val ? _c(_val) : '[?]'
    }

    // Informações básicas
    let content = [
      `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_NAME')}:*** ` +
        getValOrNotDefined(profile.name),
      `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_NICK')}:*** ` +
        getValOrNotDefined(profile.nick),
      `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_AGE')}:*** ` +
        getValOrNotDefined(profile.birth, v => {
          return (
            new AgeFromDate(v).age + ' ' +
            Dictionary.getMessage(_config.lang, 'general', 'YEARS')
          )
        }),
      `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_LOCATE')}:*** ` +
        `${getValOrNotDefined(profile.city)}/${getValOrNotDefined(profile.state)} - ` +
        getValOrNotDefined(profile.country),
    ]

    // Informações das versões
    versions.map(([ initials, name, ]) => {
      content = content.concat([
        `\n***Don\'t Starve ${name}***\n`,
        `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_HAVE')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].have, v => {
            return Dictionary.getMessage(_config.lang, 'general', v === '1' ? 'YES' : 'NO')
          }),
        `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_PLATFORM')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].platform),
        `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_HOURS_PLAYED')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].hours),
        `***Main?*** ${getValOrNotDefined(profile.experiences[initials].main)}`,
        `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_SURVIVED')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].survived) +
          Dictionary.getMessage(_config.lang, 'profile', 'DAYS'),
        `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_LEVEL')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].level),
      ])
    })

    // A mensagem
    const embed = this.embedMessage({
      title: '> ' + Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_NAME', {
        name: profileName,
      }),
      description: content.join('\n'),
      thumbnail: profileAvatar,
    }, _message)

    // Respode
    _message.reply(embed)
  }

  /**
   * @description Edita uma informação de um perfil
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async edit (_args, _message, _config) {
    // Versões do jogo
    const versions = require('../versions')

    // Recebe parâmetros tratados
    const params = this.params(_args)

    // Parâmetros do perfil principal
    const mainParams = objectFilter(params.set, i => typeof i !== 'object')

    // Parâmetros das experiencias das versões do jogo
    const versionParams = {}

    // Valores das experiencias das versões do jogo
    versions.map(v => {
      if (!params.set[v]) return

      versionParams[v] = params.set[v]
    })

    // Promessas
    const promises = []

    // Erros
    const errors = []

    // Condições a serem usadas
    const where = { id: this.authorId(_message), }

    // Salva perfil principal e adiciona promessa em array
    promises.push(
      ProfileService.update(mainParams, where, 'edit', _config).catch(e => {
        if (e) errors.push(e)

        return Promise.reject(e)
      })
    )

    // Salva perfil das experiencias e adiciona promessas em array
    versions.map(v => {
      if (!versionParams[v]) return

      // Condições a serem usadas
      const where = { user: this.authorId(_message), version: v, }

      promises.push(
        ExperienceService.update(versionParams[v], where, 'edit', _config).catch(e => {
          if (e) errors.push(e)

          return Promise.reject(e)
        }))
    })

    // Se todas as promessas foram resolvidas
    Promise.all(promises)
      .then(() => {
        _message.reply(Dictionary.getMessage(_config.lang, 'profile', 'UPDATE'))
      })
      .catch(() => {
        errors.map(e => _message.reply(e))

        _message.reply(Dictionary.getMessage(_config.lang, 'profile', 'UPDATE_ERROR'))
      })
  }

  /**
   * @description Chamado quando chamar um método não existente
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  invalidRedir (_args, _message, _config) {
    // As menções
    const mentions = _message.mentions.users.array()

    // Se não mencionou ninguém, informa e finaliza
    if (mentions.length === 0) {
      global.Bot.methodNotExists(_message, _args[0], _config)

      return
    }

    // Chama método de vizualização
    this.view(mentions, _message, _config)
  }
}

module.exports = new Profile()