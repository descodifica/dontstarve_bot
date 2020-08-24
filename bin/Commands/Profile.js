// Calcula idade
const { AgeFromDate, } = require('age-calculator')

// Importa versões
const versions = require('../versions')

// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa serviço padrão de perfil
const ProfileService = require('../Services/Profile')

// O comando de perfis
class Profile extends DefaultCommand {
  constructor () {
    super({
      options: {
        backProfileModule: (_Message, _config) => {
          return {
            icon: 'dramaMasks',
            name: Dictionary.get('profile.profile', _config),
            value: Dictionary.get('profile.backProfileModule', _config),
            callback: () => require('./Profile').main(_Message, _config),
          }
        },
        backProfile: (_Message, _config, _user) => {
          return {
            icon: 'eye',
            name: Dictionary.get('profile.profile', _config),
            value: Dictionary.get('profile.backProfile', _config),
            callback: () => require('./Profile').view(_Message, _config, [ _user, ]),
          }
        },
      },
    })
  }

  /**
   * @description Método principal
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async main (_Message, _config) {
    // Se usuário possui perfil
    const profileExists = await ProfileService.get(_Message.authorId())

    const defs = {
      title: Dictionary.get('profile.index', _config),
      options: {
        main: [
          ...(
            profileExists
              ? [
                {
                  icon: 'user',
                  name: Dictionary.get('profile.mainViewMenu', _config),
                  value: Dictionary.get('profile.mainViewMenuResume', _config),
                  callback: () => this.viewMain(_Message, _config),
                },
                {
                  icon: 'pencil',
                  name: Dictionary.get('profile.editMenu', _config),
                  value: Dictionary.get('profile.editMenuResume', _config),
                  callback: () => this.edit(_Message, _config),
                },
              ]
              : [
                {
                  icon: 'new',
                  name: Dictionary.get('profile.mainCreateMenu', _config),
                  value: Dictionary.get('profile.mainCreateMenuResume', _config),
                  callback: () => this.create(_Message, _config),
                },
              ]
          ),
          {
            icon: 'magnifyingGlass',
            name: Dictionary.get('profile.listMenu', _config),
            value: Dictionary.get('profile.listMenuResume', _config),
            callback: () => this.list(_Message, _config),
          },
          {
            icon: 'eye',
            name: Dictionary.get('profile.viewMenu', _config),
            value: Dictionary.get('profile.viewMenuResume', _config),
            callback: () => this.viewOther(_Message, _config),
          },
        ],
        'general.navegateGroupOptions': [
          require('./Init').options.backStart(_Message, _config),
        ],
      },
    }

    _Message.sendPrompt(defs, _config)
  }

  /**
   * @description Cria perfil do usário
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async create (_Message, _config) {
    await ProfileService.create({ id: _Message.authorId(), })

    const defs = {
      title: Dictionary.get('profile.createSuccess', _config),
      options: [
        require('./Profile').options.backProfile(_Message, _config, _Message.author()),
        require('./Init').options.backStart(_Message, _config),
      ],
    }

    _Message.sendPrompt(defs, _config)
  }

  /**
   * @description Busca e lista pergis
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {Object} _params Outros parâmetros
   */
  async list (_Message, _config, _params = { page: 1, }) {
    // Busca
    const profiles = await ProfileService.list(_params)

    // Definições
    const defs = {
      options: [
        {
          icon: 'preview',
          name: Dictionary.get('general.preview', _config, { amount: 10, }),
          value: Dictionary.get('profile.previewPlayers', _config, { amount: 10, }),
          inline: true,
          callback: () => this.list(_Message, _config, { ..._params, page: _params.page - 1, }),
        },
        {
          icon: 'next',
          name: Dictionary.get('general.next', _config),
          value: Dictionary.get('profile.nextPlayers', _config, { amount: 10, }),
          inline: true,
          callback: () => this.list(_Message, _config, { ..._params, page: _params.page + 1, }),
        },
        require('./Profile').options.backProfileModule(_Message, _config),
        require('./Init').options.backStart(_Message, _config),
      ],
    }

    if (profiles.length === 0) {
      const defs2 = {
        ...defs,
        title: Dictionary.get('profile.frofilesNotFound', _config),
      }

      _Message.sendPrompt(defs2, _config)
    }
    else {
      const options = [
        ...profiles.map((profile, pos) => {
          const option = {
            icon: `number_${pos + 1}`,
            name: profile.nick || profile.name,
            callback: () => {
              const user = _Message.serverMembers().get(profiles[pos + 1].id).user

              this.view(_Message, _config, [ user, ])
            },
          }

          return option
        }),
        ...defs.options,
      ]

      profiles.map(profile => {
        const defs2 = {
          ...defs,
          title: Dictionary.get('profile.frofilesFound', _config),
          description: Dictionary.get('profile.frofilesFoundDescription', _config),
          options,
        }

        _Message.sendPrompt(defs2, _config)
      })
    }
  }

  /**
   * @description Ver perfis
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {Array} _users Usuários a terem perfil exibido
   */
  async view (_Message, _config, _users) {
    // Id de todos os usuários
    const ids = _users.map(i => i.id)

    // Busca perfis
    const profiles = await ProfileService.list({ where: { id: { type: 'IN', value: ids, }, }, })

    // Ids dos perfis encontrados
    const foundIds = profiles.map(i => i.id)

    // Ids dos perfis não encontrados
    const unfoundIds = ids.filter(id => foundIds.indexOf(id) === -1)

    // Exibe perfis
    profiles.map(profile => {
      // Captura dados do usuário
      const user = _users.get ? _users.get(profile.id) : _users[0]

      // Monta conteúdo do perfil
      const content = (
        this.mountBasicProfile(profile, _config) +
        '\n\n' +
        Dictionary.get('profile.moreInformation', _config, {}, { bold: true, })
      )

      const defs = {
        title: Dictionary.get('profile.title', _config, { name: user.username, }),
        thumbnail: user.displayAvatarURL(),
        description: content,
        options: {
          main: [
            {
              icon: 'death',
              name: Dictionary.get('experience.experienceIn', _config, { version: versions.ds, }),
              callback: () => require('./Experience').view(_Message, _config, 'ds', user),
            },
            {
              icon: 'island',
              name: Dictionary.get('experience.experienceIn', _config, { version: versions.sw, }),
              callback: () => require('./Experience').view(_Message, _config, 'sw', user),
            },
            {
              icon: 'castle',
              name: Dictionary.get('experience.experienceIn', _config, { version: versions.ham, }),
              callback: () => require('./Experience').view(_Message, _config, 'ham', user),
            },
            {
              icon: 'ghost',
              name: Dictionary.get('experience.experienceIn', _config, { version: versions.dst, }),
              callback: () => require('./Experience').view(_Message, _config, 'dst', user),
            },
          ],
          'general.navegateGroupOptions': [
            this.options.backProfileModule(_Message, _config),
            require('./Init').options.backStart(_Message, _config),
          ],
        },
      }

      // Envia perfil básico com opções
      // Se pediu mais detalhes de uma experiência
      _Message.sendPrompt(defs, _config)
    })

    // Informa perfis não encontrados
    unfoundIds.map(id => {
      const user = _Message.serverMembers().get(id).user

      _Message.sendEmbedMessage({
        title: user.username,
        thumbnail: user.displayAvatarURL(),
        description: Dictionary.get('profile.profileNotCreated', _config),
      })
    })
  }

  /**
   * @description Ver perfil de alguem
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async viewOther (_Message, _config) {
    // Pergunta e trata resposta
    const response = await _Message.ask(Dictionary.get('profile.whichProfileSee', _config))

    // Captura usuários mencionados
    const users = response.mentions().users

    // Lista de usuários
    const usersList = users.array ? users.array() : [ users, ]

    this.view(_Message, _config, usersList)
  }

  /**
   * @description Ver perfil próprio
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  viewMain (_Message, _config) {
    this.view(_Message, _config, [ _Message.author(), ])
  }

  /**
   * @description Retorna o conteúdo do perfil bádico
   * @param {Object} _profile O perfil
   * @param {Object} _config As configurações do servidor
   * @returns {String}
   */
  mountBasicProfile (_profile, _config) {
    const description = []

    const labelFormat = { label: true, }

    if (_profile.name) {
      description.push(
        Dictionary.get('profile.name', _config, {}, labelFormat) + _profile.name
      )
    }

    if (_profile.nick) {
      description.push(
        Dictionary.get('profile.nick', _config, {}, labelFormat) + _profile.name
      )
    }

    if (_profile.genre) {
      description.push(
        Dictionary.get('profile.genre', _config, {}, labelFormat) +
        (
          _profile.genre === '1'
            ? Dictionary.get('profile.male', _config)
            : Dictionary.get('profile.female', _config)
        )
      )
    }

    if (_profile.birth) {
      description.push(
        Dictionary.get(
          'profile.age', _config, {}, labelFormat) + new AgeFromDate(_profile.birth).age
      )
    }

    if (_profile.city) {
      description.push(
        Dictionary.get('profile.city', _config, {}, labelFormat) + _profile.city
      )
    }

    if (_profile.state) {
      description.push(
        Dictionary.get('profile.state', _config, {}, labelFormat) + _profile.state
      )
    }

    if (_profile.country) {
      description.push(
        Dictionary.get('profile.country', _config, {}, labelFormat) + _profile.country
      )
    }

    return description.join('\n')
  }

  /**
   * @description Atualiza uma propriedade
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {Array} _prop Propriedade a ser atualizada
   * @param {String} _version Versão a ser atualizada
   */
  async edit (_Message, _config, _prop) {
    const update = _prop => {
      // Condições dos dados a serem atualizados
      const where = { id: _Message.authorId(), }

      // Atualiza
      ProfileService.updateProp(_prop, where, _Message, _config)
        .then(response => {
          return Dictionary.get(`profile.${_prop}UpdateSuccess`, _config)
        })
        .catch(e => {
          return Dictionary.get(`profile.${_prop}UpdateError`, _config)
        })
        .then(async title => { // Menu
          const defs = {
            title: title,
            options: [
              require('./Profile').options.backProfileModule(_Message, _config),
              require('./Init').options.backStart(_Message, _config),
            ],
          }

          _Message.sendPrompt(defs, _config)
        })
    }

    const options = {
      main: [
        {
          icon: 'ticket',
          name: Dictionary.get('profile.name', _config),
          value: Dictionary.get('profile.nameResume', _config),
          callback: () => update('name'),
        },
        {
          icon: 'label',
          name: Dictionary.get('profile.nick', _config),
          value: Dictionary.get('profile.nickResume', _config),
          callback: () => update('nick'),
        },
        {
          icon: 'genre',
          name: Dictionary.get('profile.genre', _config),
          value: Dictionary.get('profile.genreResume', _config),
          callback: () => update('genre'),
        },
        {
          icon: 'cake',
          name: Dictionary.get('profile.age', _config),
          value: Dictionary.get('profile.ageResume', _config),
          callback: () => update('birth'),
        },
        {
          icon: 'city',
          name: Dictionary.get('profile.city', _config),
          value: Dictionary.get('profile.cityResume', _config),
          callback: () => update('city'),
        },
        {
          icon: 'road',
          name: Dictionary.get('profile.state', _config),
          value: Dictionary.get('profile.stateResume', _config),
          callback: () => update('state'),
        },
        {
          icon: 'country',
          name: Dictionary.get('profile.country', _config),
          value: Dictionary.get('profile.countryResume', _config),
          callback: () => update('country'),
        },
        {
          icon: 'death',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.ds, }),
          value: Dictionary.get(
            'experience.experienceInResume', _config, { version: versions.ds, }
          ),
          callback: () => require('./Experience').edit(_Message, _config, 'ds'),
        },
        {
          icon: 'island',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.sw, }),
          value: Dictionary.get(
            'experience.experienceInResume', _config, { version: versions.sw, }
          ),
          callback: () => require('./Experience').edit(_Message, _config, 'sw'),
        },
        {
          icon: 'castle',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.ham, }),
          value: Dictionary.get(
            'experience.experienceInResume', _config, { version: versions.ham, }
          ),
          callback: () => require('./Experience').edit(_Message, _config, 'ham'),
        },
        {
          icon: 'ghost',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.dst, }),
          value: Dictionary.get(
            'experience.experienceInResume', _config, { version: versions.dst, }
          ),
          callback: () => require('./Experience').edit(_Message, _config, 'dst'),
        },
      ],
      'general.navegateGroupOptions': [
        require('./Profile').options.backProfileModule(_Message, _config),
        require('./Init').options.backStart(_Message, _config),
      ],
    }

    const defs = {
      title: Dictionary.get('profile.editAsk', _config),
      options,
    }

    // Envia menu e executa comando desejado
    await _Message.sendPrompt(defs, _config)
  }
}

module.exports = new Profile()