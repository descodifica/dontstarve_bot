// TODO: Adicionar mods

// Percorre todos os campos de um json
const objectMap = require('object.map')

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
    // Id do perfil
    const profileId = _args.length === 0 ? this.authorId(_message) : _args[0].id

    // Nome do perfil
    const profileName = _args.length === 0 ? this.authorUserName(_message) : _args[0].username

    const profileAvatar = (
      _args.length === 0 ? this.authorAvatar(_message) : _args[0].displayAvatarURL()
    )

    // Busca o perfil
    let profile = await ProfileService.get(profileId)

    // Se não achou, cria, informa e busca novamente
    if (!profile) {
      await ProfileService.create({ id: profileId, })

      _message.reply(
        Dictionary.getMessage(_config.lang, 'profile', 'CREATE', { prefix: _config.prefix, })
      )

      profile = await ProfileService.get(profileId)
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
            switch (v) {
              case 1: v = 'ABDUCTED'
                break
              case 2: v = 'HUNGRY'
                break
              case 3: v = 'EXPLORER'
                break
              case 4: v = 'SURVIVOR'
                break
              case 5: v = 'BACKPACKER'
                break
              case 6: v = 'CONSTANTIAN'
                break
              case 7: v = 'CHARLIES_FRIEND'
                break
              case 8: v = 'KING_OF_CONSTANT'
                break
              case 9: v = 'ALLY_OF_THEY_TEXT'
            }

            profile.experiences[k][prop] = Dictionary.getMessage(
              _config.lang, 'profile', v + '_TEXT'
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
            new AgeFromDate(v).age +
            Dictionary.getMessage(_config.lang, 'general', 'YEARS')
          )
        }),
      `***${Dictionary.getMessage(_config.lang, 'profile', 'PROFILE_LOCATE')}:*** ` +
        `${getValOrNotDefined(profile.city)}/${getValOrNotDefined(profile.state)}` +
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