// TODO: Adicionar mods
// TODO: Adicionar identificação sexual

// Percorre todos os campos de um json
const objectMap = require('object.map')

// Calcula idade
const { AgeFromDate, } = require('age-calculator')

// Serviços
const ProfileService = require('../../services/Profile')
const ExperienceService = require('../../services/Experience')
const CharacterService = require('../../services/Character')

// Importa comando padrão
const DefaultCommand = require('../Default')
const Dictionary = require('../../Dictionary')
const { Message, } = require('discord.js')
const config = require('../../config')

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
    const hasMention = _Message.hasUserMention()

    // Perfis a serem exibidos
    const profiles = hasMention ? _Message.mentions().users.array() : [ _Message.author(), ]

    // Função de tratamento de não informado
    const getValOrNotDefined = (_val, _c = v => v) => {
      return _val ? _c(_val) : '[?]'
    }

    profiles.map(async profile => {
      // Id do perfil
      const profileId = profile.id

      // Nome do perfil
      const profileName = profile.username

      // Avatar do perfil
      const profileAvatar = profile.displayAvatarURL()

      // Busca o perfil
      profile = await ProfileService.get(profileId)

      // Se não achou
      if (!profile) {
        // Se não tem menção, cria, informa e busca novamente
        if (!hasMention) {
          await ProfileService.create({ id: profileId, })
          await ExperienceService.create({ user: profileId, version: 'DS', })
          await ExperienceService.create({ user: profileId, version: 'SW', })
          await ExperienceService.create({ user: profileId, version: 'HAM', })
          await ExperienceService.create({ user: profileId, version: 'DST', })

          profile = await ProfileService.get(profileId)

          _Message.sendFromDictionary('profile', 'PROFILE_CREATE', {
            command: (
              '**' +
              _config.prefix +
              Dictionary.getTranslateModule(_config.lang, 'help') +
              ' ' +
              Dictionary.getTranslateModule(_config.lang, 'profile') +
              ' ' +
              Dictionary.getTranslateMethod(_config.lang, 'profile', 'edit') +
              '**'
            ),
          })
        }
        // Se tem mensão, manda mensagem informando que não tem perfil e finaliza
        else {
          // Envia
          _Message.sendEmbedMessage({
            title: '> ' + Dictionary.getMessage(_config, 'profile', 'PROFILE_PROFILE', {
              name: profileName,
            }),
            description: _Message.getFromDictionary('profile', 'NO_PROFILE', {
              profile: _Message.createMention(profileId),
            }),
            thumbnail: profileAvatar,
          })

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
                  break
                default: return
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
              promise.then(data => profile.experiences[k][prop] = (data || {}).name)

              // Adiciona promessa na lista para que aguarde
              pendingPromises.push(promise)
            }
          }
        })
      })

      // Aguarda a finalização de todas as promessas
      await Promise.all(pendingPromises)

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
        title: '> ' + Dictionary.getMessage(_config, 'profile', 'PROFILE_PROFILE', {
          name: profileName,
        }),
        description: content.join('\n'),
        thumbnail: profileAvatar,
      })
    })
  }

  /**
   * @description Edita uma informação de um perfil
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async edit (_Message, _config) {
    // Versões do jogo
    const versions = require('../../versions')

    // Recebe parâmetros tratados
    const params = this.params('profile', 'edit', _Message.args, _Message.serverConfig.lang)

    // Promessas
    const promises = []

    // Erros
    const errors = []

    // Condições a serem usadas
    const where = { id: _Message.authorId(), }

    // Salva perfil principal e adiciona promessa em array
    promises.push(
      ProfileService.update(params.set, where, 'edit', _config).catch(e => {
        if (e) errors.push(e)

        return Promise.reject(e)
      })
    )

    // Salva perfil das experiencias e adiciona promessas em array
    versions.map(v => {
      const params = this.params(
        'experience', 'edit', _Message.args, _Message.serverConfig.lang, v + '.'
      )

      if (Object.keys(params.set).length === 0) return

      // Condições a serem usadas
      const where = { user: _Message.authorId(), version: v, }

      promises.push(
        ExperienceService.update(params.set, where, 'edit', _config).catch(e => {
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
   * @description Lista os perfis disponíveis
   * @param {Object} _Message A mensagem enviada pelo usuário
   * @param {Object} _config As configurações do servidor
   */
  async list (_Message, _config) {
    // Recebe parâmetros tratados
    const params = this.params('profile', 'list', _Message.args, _Message.serverConfig.lang)

    // Busca perfis
    const profiles = await ProfileService.list({ page: params.set.pag || 1, })

    // Se não achou perfil, informa e finaliza
    if (profiles.length === 0) {
      _Message.sendFromDictionary('profile', 'NO_PROFILE_FOUND')

      return
    }

    // Onde ficará a lista
    const list = []

    // Monta a lista com base nos resultados da busca
    profiles.map(async (i, k) => {
      // Array de mensagem
      const msg = []
      // Objeto com outros dados a serem informados na mensagem
      const data = { age: '', locate: '', }

      // Se tem nascimento, calcula idade e adiciona no objeto de outros dados
      if (i.birth) {
        data.age = (
          new AgeFromDate(i.birth).age + ' ' + _Message.getFromDictionary('general', 'YEARS')
        )
      }

      // Se tem cidade, adiciona no objeto de outros dados
      if (i.city) data.locate += i.city

      // Se tem estado, concatena na cidade da lista de outros dados
      if (i.state) {
        if (i.city) data.locate += ' / '

        data.locate += i.state
      }

      // Se tem país, concatena na cidade da lista de outros dados
      if (i.country) {
        if (i.city || i.state) data.locate += ' - '

        data.locate += i.country
      }

      // Recebe outros dados em array filtrando os em branco
      const dataArray = Object.values(data).filter(i => i !== '')

      // Adiciona nick ou nome e mensão do jogador na mensagem
      msg.push((i.nick || i.name ? i.nick || i.name + ' ' : '') + _Message.createMention(i.id))
      msg.push('\n')

      // Se tem outros dados, adiciona na mensagem
      if (dataArray.length > 0) {
        msg.push('*' + dataArray.join(' | ') + '*')
        msg.push('\n')
      }

      // Adiciona mensagem a lista
      list.push(msg.join(''))
    })

    // Monta conteúdo da mensagem
    const description = (
      list.join('\n') +
      '\n*' +
      (
        _Message.getFromDictionary(
          'profile', 'USE_PAGE_PARAM', {
            param: (
              Dictionary.getTranslateMethodParam(_config.lang, 'profile', 'list', 'pag') +
              ' ' +
              _Message.getFromDictionary('profile', 'N')
            ),
          }
        )
      ) +
      '*' +
      '\n*' +
      (
        _Message.getFromDictionary('profile', 'LIST_HELP', {
          command: (
            '`' +
            _config.prefix +
            Dictionary.getTranslateModule(_config.lang, 'help') +
            ' ' +
            Dictionary.getTranslateModule(_config.lang, 'profile') +
            ' ' +
            Dictionary.getTranslateMethod(_config.lang, 'profile', 'list') +
            '`'
          ),
        })
      ) +
      '*'
    )

    // Envia a lista
    _Message.sendEmbedMessage({ title: 'Jogadores (Página 1)', description, })
  }

  /**
   * @description Chamado quando chamar um método não existente
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  invalidRedir (_Message, _config) {
    // As menções
    const mentions = _Message.mentions().users.array()

    // Se não mencionou ninguém, informa e finaliza
    if (mentions.length === 0) {
      global.Bot.methodNotExists(_Message, _Message.originalMethod, _config)
    }

    // Chama método de vizualização
    this.view(_Message, _config)
  }
}

module.exports = new Profile()