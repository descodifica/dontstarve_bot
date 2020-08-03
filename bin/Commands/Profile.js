// TODO: Adicionar mods
// TODO: Adicionar identificação sexual

// Percorre todos os campos de um json
const objectMap = require('object.map')

// Calcula idade
const { AgeFromDate, } = require('age-calculator')

// Serviços
const ProfileService = require('../services/Profile')
const ExperienceService = require('../services/Experience')
const CharacterService = require('../services/Character')

// Importa comando padrão
const DefaultCommand = require('./Default')
const Dictionary = require('../Dictionary')

// O comando de Perfil
class Profile extends DefaultCommand {
  constructor () {
    super({
      doc: {
        view: (_Message, { prefix, }) => {
          const commandTranslated = Dictionary.getTranslateModule(
            _Message.serverConfig.lang, 'profile'
          )

          const methodTranslated = Dictionary.getTranslateMethod(
            _Message.serverConfig.lang, 'profile', 'view'
          )

          const user = Dictionary.getMessage(_Message.serverConfig, 'general', '@USER')

          const shortcut = Dictionary.getMessage(_Message.serverConfig, 'general', 'SHORTCUT')

          _Message.setFromDictionary('general', 'EXAMPLES', {}, { breakLine: 2, })

          _Message.setExampleAndExplanation(
            prefix + commandTranslated + ' ' + methodTranslated,
            Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_VIEW_ONLY'),
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            (
              prefix + commandTranslated + ' ' + methodTranslated + ' ' + user + '1'
            ),
            Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_VIEW_MENTION'),
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            (
              prefix + commandTranslated + ' ' + methodTranslated + ' ' +
              user + '1' + ' ' + user + '2' + ' ' + user + '3'
            ),
            Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_VIEW_MENTIONS'),
            { breakBottom: 2, }
          )

          _Message.set(`**${shortcut}:** \`${prefix}${commandTranslated}\``)
        },
        edit: (_Message, { prefix, }) => {
          const yesTranslated = Dictionary.getMessage(
            _Message.serverConfig, 'general', 'YES'
          )

          const noTranslated = Dictionary.getMessage(
            _Message.serverConfig, 'general', 'NO'
          )

          const commandTranslated = Dictionary.getTranslateModule(
            _Message.serverConfig.lang, 'profile'
          )

          const methodTranslated = Dictionary.getTranslateMethod(
            _Message.serverConfig.lang, 'profile', 'edit'
          )

          const commandMethod = prefix + commandTranslated + ' ' + methodTranslated

          const paramNameTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'profile', 'edit', 'name'
            )
          )

          const paramNickTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'profile', 'edit', 'nick'
            )
          )

          const paramBirthTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'profile', 'edit', 'birth'
            )
          )

          const paramGenreTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'profile', 'edit', 'genre'
            )
          )

          const paramCityTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'profile', 'edit', 'city'
            )
          )

          const paramStateTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'profile', 'edit', 'state'
            )
          )

          const paramCountryTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'profile', 'edit', 'country'
            )
          )

          const paramHaveTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'experience', 'edit', 'have'
            )
          )

          const paramPlatformTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'experience', 'edit', 'platform'
            )
          )

          const paramHoursTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'experience', 'edit', 'hours'
            )
          )

          const paramMainTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'experience', 'edit', 'main'
            )
          )

          const paramSurvivedTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'experience', 'edit', 'survived'
            )
          )

          const paramRankTranslated = (
            Dictionary.getTranslateMethodParam(
              _Message.serverConfig.lang, 'experience', 'edit', 'rank'
            )
          )

          _Message.setFromDictionary('profile', 'HELP_PROFILE_ABOUT', {}, { breakLine: 2, })

          _Message.setFromDictionary(
            'profile', 'HELP_PROFILE_ABOUT_PERSONAL', {}, { breakLine: 2, }
          )

          _Message.setFromDictionary(
            'profile',
            'HELP_PROFILE_ABOUT_PERSONAL_EDIT',
            { command: commandTranslated, method: methodTranslated, },
            { breakLine: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' ' + paramNameTranslated + ' "Rafael Dias"',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_NAME_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' ' + paramNickTranslated + ' Hiker',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_NICK_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' ' + paramBirthTranslated + ' 03/07/1986',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_BIRTH_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_VALID_DATE'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' ' + paramGenreTranslated + ' 1',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_GENRE_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_BOOLEAN', {
                  values: [ 'Feminino', 'Masculino', ],
                }
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' ' + paramCityTranslated + ' Petrópolis',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_CITY_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_ALLOW_FIELD'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' ' + paramStateTranslated + ' "Rio de Janeiro"',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_STATE_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_ALLOW_FIELD'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' ' + paramCountryTranslated + ' Brasil',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_COUNTRY_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_ALLOW_FIELD'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setFromDictionary(
            'profile',
            'HELP_PROFILE_ABOUT_EXPERIENCE_EDIT',
            {},
            { breakLine: 2, }
          )

          _Message.set(
            '`ds.`   *Don\'t Starve*\n' +
            '`sw.`   *Don\'t Starve Shipwrecked*\n' +
            '`ham.` *Don\'t Starve Hamet*\n' +
            '`dst.` *Don\'t Starve Together*\n\n'
          )

          _Message.setFromDictionary(
            'profile',
            'HELP_PROFILE_ABOUT_EXPERIENCE_TO_EXAMPLE',
            {},
            { breakLine: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' dst.' + paramHaveTranslated + ' 1',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_HAVE_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_BOOLEAN', {
                  values: [ noTranslated, yesTranslated, ],
                }
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' dst.' + paramPlatformTranslated + ' Steam',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_PLATFORM_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_ACCEPT_VALUES_ONLY',
                {
                  values: 'Steam, PS, Xbox, Android',
                  lastValue: 'Iphone',
                }
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' dst.' + paramHoursTranslated + ' 300',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_HOURS_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_INTEGER_ONLY'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' dst.' + paramMainTranslated + ' Wickerbottom',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_MAIN_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'experience', 'HELP_ABOUT_CHARACTER_ONLY'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' dst.' + paramSurvivedTranslated + ' 99',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_SURVIVED_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_INTEGER_ONLY'
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            commandMethod + ' dst.' + paramRankTranslated + ' 4',
            [
              Dictionary.getMessage(
                _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_RANK_PARAM'
              ),
              Dictionary.getMessage(
                _Message.serverConfig, 'general', 'HELP_ABOUT_INTEGER_ONLY', {
                  range: [ 0, 9, ],
                }
              ),
            ],
            { breakBottom: 2, }
          )

          _Message.setFromDictionary(
            'profile',
            'HELP_PROFILE_MULTIPLE_EDIT',
            {},
            { breakLine: 2, }
          )

          _Message.set(
            `\`${prefix}${commandTranslated} ${methodTranslated} ` +
              `${paramNameTranslated} "Rafael Dias" ` +
              `${paramBirthTranslated} 03/07/1986 ` +
              `dst.${paramMainTranslated} Wickerbottom\``
          )
        },
      },
    })
  }

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

      // Se não achou e não tem menção, cria, informa e busca novamente
      if (!profile) {
        await ProfileService.create({ id: profileId, })
        await ExperienceService.create({ user: profileId, version: 'DS', })
        await ExperienceService.create({ user: profileId, version: 'SW', })
        await ExperienceService.create({ user: profileId, version: 'HAM', })
        await ExperienceService.create({ user: profileId, version: 'DST', })

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
    const versions = require('../versions')

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
        // _Message.sendFromDictionary(e.module, e.error, e.params)
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