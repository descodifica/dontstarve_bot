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

// O comando de Perfil
class Profile extends DefaultCommand {
  constructor () {
    super({
      doc: {
        view: (_Message, { prefix, }) => {
          _Message.set('***Exemplos:***\n\n')

          _Message.setExampleAndExplanation(
            prefix + 'perfil ver',
            'Visualiza o próprio perfil',
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil ver @Usuario',
            'Visualiza o perfil do jogador mencionado',
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil ver @Usuario1 @Usuario2 @Usuario3',
            'Visualiza o perfil de todos os jogadores mencionados',
            { breakBottom: 2, }
          )

          _Message.set(`***Atalho:*** \`${prefix}perfil\``)
        },
        edit: (_Message, { prefix, }) => {
          _Message.set(
            'O perfil é dividido em duas sessões básicas: ***Pessoal*** e ***Jogo***.\n\n' +
            'A sessão pessoal exibe informações básicas do jogador enquanto a sessão de jogo ' +
              'exibe informações do jogador em relação aos diferentes jogos da franquia.\n\n' +
            `Para editar as informações básicas, basta entrar com \`${prefix}perfil editar\` ` +
              'seguido do identificador da informação. Veja:\n\n'
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar nome "Rafael Dias"',
            [
              'Edita o nome do jogador.',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar nick "Hiker"',
            [
              'Edita o nick do jogador.',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar nascimento 03/07/1986',
            [
              'Edita a data de nascimento do jogador a qual é usada para calcular a idade.',
              'Note que a data deve ser colocada no formato dd/mm/aaaa.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar genero 1',
            [
              'Edita o gênero do jogador.',
              'Note que aceita somente **1** para **Masculino** e **0** para **Feminino**',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar cidade Petrópolis',
            [
              'Edita a cidade do jogador',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
              'Note também que este é um campo livre, porém procure escrever corretamente' +
                'respeitando maiúsculas, acentos, sem abreviações e etc caso queira ser ' +
                'encontrado nas buscas pela cidade.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar estado "Rio de Janeiro"',
            [
              'Edita o estado do jogador',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
              'Note também que este é um campo livre, porém procure escrever corretamente' +
                'respeitando maiúsculas, acentos, sem abreviações e etc caso queira ser ' +
                'encontrado nas buscas pelo estado.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar pais Brasil',
            [
              'Edita o país do jogador',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
              'Note também que este é um campo livre, porém procure escrever corretamente' +
                'respeitando maiúsculas, acentos, sem abreviações e etc caso queira ser ' +
                'encontrado nas buscas pelo país.',
            ],
            { breakBottom: 2, }
          )

          _Message.set(
            'Para editar as informações de jogo é a mesma coisa, porém acrescentamos um ' +
            'prefixo ao nome da informação para informar a versão do jogo que desejamos ' +
            'alterar. Os prefixos disponíveis são\n\n' +
            '`ds.` *Don\'t Starve*\n' +
            '`sw.` *Don\'t Starve Shipwrecked*\n' +
            '`ham.` *Don\'t Starve Hamet*\n' +
            '`dst.` *Don\'t Starve Together*\n\n' +
            'Para exemplificar a edição das informações de jogo, utilizaremos o prefixo da ' +
              'versão Together do jogo, mas basta trocar o prefixo para mudar de versão!' +
            'Veja:\n\n'
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.possui 1',
            [
              'Define se o jogador possui esta versão do jogo.',
              'Aceita **1** para **"Sim"** e **0** para **"Não"**.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.plataforma Steam',
            [
              'Define em qual plataforma o jogador possui esta versão do jogo.',
              'Aceita somente os valores: Steam, PS, Xbox, Android ou Iphone.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.horas 300',
            [
              'Define o número de horas do jogador nesta versão do jogo.',
              'Aceita somente números inteiros',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.main Wickerbottom',
            [
              'Define se o jogador é "Main" de algum personagem.',
              'Aceita somente os nomes dos personagens.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.sobreviveu 99',
            [
              'Define quantos dias no maximo o jogador conseguiu sobreviver nesta versão do jogo',
              'Aceita somente números inteiros',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.rank 4',
            [
              'Define o rank do jogador nesta versão, sendo que quanto menor o número, mais ' +
                'experiente ele é.',
              'Aceita somente números inteiros de 1 a 9',
            ],
            { breakBottom: 2, }
          )

          _Message.set(
            'Também vale dizer que você não precisa editar uma única informação por comando, ' +
              'mas pode sim editar várias de uma só vez: Veja:\n\n' +
              `\`${prefix}perfil editar nome "Rafael Dias" nascimento 03/07/1986 dst.main ` +
              'Wickerbottom\`'
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