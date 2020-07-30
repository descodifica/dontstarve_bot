// TODO: Adicionar mods
// TODO: Adicionar identificação sexual

// Percorre todos os campos de um json
const objectMap = require('object.map')

// Filtra objetos
const objectFilter = require('object-filter')

// Calcula idade
const { AgeFromDate, } = require('age-calculator')

// Serviços
const ProfileService = require('../services/Profile')
const ExperienceService = require('../services/Experience')
const CharacterService = require('../services/Character')

// Importa comando padrão
const DefaultCommand = require('./Default')

// O comando de Perfil
class Profile extends DefaultCommand {
  /**
   * @description Visualiza um perfil
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (Message, _config) {
    this.view(Message, _config)
  }

  /**
   * @description Visualiza um perfil
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async view (_Message, _config) {
    // Se pediu perfil de alguém
    const hasMention = _Message.hasArgs()

    // Id do perfil
    const profileId = !hasMention ? _Message.authorId() : _Message.args[0].id

    // Nome do perfil
    const profileName = !hasMention ? _Message.authorUserName() : _Message.args[0].username

    // Avatar do perfil
    const profileAvatar = (
      !hasMention ? _Message.authorAvatar() : _Message.args[0].displayAvatarURL()
    )

    // Busca o perfil
    let profile = await ProfileService.get(profileId)

    // Se não achou e não tem menção, cria, informa e busca novamente
    // Se tem mensão, informa apenas
    if (!profile) {
      if (!hasMention) {
        await ProfileService.create({ id: profileId, })

        _Message.sendFromDictionary('profile', 'CREATE')

        profile = await ProfileService.get(profileId)
      }
      else {
        _Message.channel.send('profile', 'NO_PROFILE', { user: profileName, })

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
              _config, 'profile', id + '_TEXT'
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
      `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_NAME')}:*** ` +
        getValOrNotDefined(profile.name),
      `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_NICK')}:*** ` +
        getValOrNotDefined(profile.nick),
      `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_AGE')}:*** ` +
        getValOrNotDefined(profile.birth, v => {
          return (
            new AgeFromDate(v).age + ' ' +
            Dictionary.getMessage(_config, 'general', 'YEARS')
          )
        }),
      `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_GENRE')}:*** ` +
        getValOrNotDefined(profile.genre, v => {
          return v === '1' ? 'Masculino' : 'Feminino'
        }),
      `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_LOCATE')}:*** ` +
        `${getValOrNotDefined(profile.city)}/${getValOrNotDefined(profile.state)} - ` +
        getValOrNotDefined(profile.country),
    ]

    // Informações das versões
    versions.map(([ initials, name, ]) => {
      content = content.concat([
        `\n***Don\'t Starve ${name}***\n`,
        `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_HAVE')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].have, v => {
            return Dictionary.getMessage(_config, 'general', v === '1' ? 'YES' : 'NO')
          }),
        `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_PLATFORM')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].platform),
        `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_HOURS_PLAYED')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].hours),
        `***Main?*** ${getValOrNotDefined(profile.experiences[initials].main)}`,
        `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_SURVIVED')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].survived) +
          Dictionary.getMessage(_config, 'profile', 'DAYS'),
        `***${Dictionary.getMessage(_config, 'profile', 'PROFILE_LEVEL')}:*** ` +
          getValOrNotDefined(profile.experiences[initials].level),
      ])
    })

    // Responde
    _Message.sendEmbedMessage({
      title: '> ' + Dictionary.getMessage(_config, 'profile', 'PROFILE_NAME', {
        name: profileName,
      }),
      description: content.join('\n'),
      thumbnail: profileAvatar,
    })
  }

  /**
   * @description Edita uma informação de um perfil
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async edit (_Message, _config) {
    // Versões do jogo
    const versions = require('../versions')

    // Recebe parâmetros tratados
    const params = this.params(_Message.args)

    // Parâmetros do perfil principal
    const mainParams = {}

    // Filtra e traduz para nome real dos parâmetros do perfil principal
    objectMap(objectFilter(params.set, i => typeof i !== 'object'), (v, k) => {
      // Nome real
      const prop = Dictionary.getMethodParam(_config.lang, 'profile', 'edit', k)

      mainParams[prop] = v
    })

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
    const where = { id: _Message.authorId(), }

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
      const where = { user: _Message.authorId(), version: v, }

      promises.push(
        ExperienceService.update(versionParams[v], where, 'edit', _config).catch(e => {
          if (e) errors.push(e)

          return Promise.reject(e)
        }))
    })

    // Se todas as promessas foram resolvidas
    Promise.all(promises)
      .then(() => {
        _Message.sendFromDictionary('profile', 'UPDATE')
      })
      .catch(e => {
        _Message.sendFromDictionary(e.module, e.error, e.params)
        _Message.sendFromDictionary('profile', 'UPDATE_ERROR')
      })
  }

  /**
   * @description Chamado quando chamar um método não existente
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  invalidRedir (_Message, _config) {
    // As menções
    const mentions = _Message.mentions.users.array()

    // Se não mencionou ninguém, informa e finaliza
    if (mentions.length === 0) {
      global.Bot.methodNotExists(_Message, _Message.args[0], _config)

      return
    }

    // Chama método de vizualização
    this.view(mentions, _Message, _config)
  }
}

module.exports = new Profile()