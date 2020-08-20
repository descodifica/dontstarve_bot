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
  /**
   * @description Método principal
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async main (_Message, _config) {
    // Se usuário possui perfil
    const profileExists = await ProfileService.get(_Message.authorId())

    // Opções do menu
    const options = []

    if (profileExists) {
      options.push({
        icon: 'user',
        name: Dictionary.get('profile.mainViewMenu', _config),
        value: Dictionary.get('profile.mainViewMenuResume', _config),
      })

      options.push({
        icon: 'pencil',
        name: Dictionary.get('profile.editMenu', _config),
        value: Dictionary.get('profile.editMenuResume', _config),
      })
    }
    else {
      options.push({
        icon: 'new',
        name: Dictionary.get('profile.mainCreateMenu', _config),
        value: Dictionary.get('profile.mainCreateMenuResume', _config),
      })
    }

    options.push({
      icon: 'magnifyingGlass',
      name: Dictionary.get('profile.listMenu', _config),
      value: Dictionary.get('profile.listMenuResume', _config),
    })

    options.push({
      icon: 'eye',
      name: Dictionary.get('profile.viewMenu', _config),
      value: Dictionary.get('profile.viewMenuResume', _config),
    })

    // Defnições do menu
    const defs = {
      title: Dictionary.get('profile.index', _config),
      options,
    }

    // Envia menu e executa comando desejado
    _Message.sendPrompt(defs).then(emoji => {
      switch (emoji._id) {
        case 'new': this.create(_Message, _config)
          break
        case 'user': this.viewMain(_Message, _config, _Message.author())
          break
        case 'pencil': this.edit(_Message, _config)
          break
        case 'magnifyingGlass': this.list(_Message, _config)
          break
        case 'eye': this.viewOther(_Message, _config)
      }
    })
  }

  /**
   * @description Cria perfil do usário
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async create (_Message, _config) {
    await ProfileService.create({ id: _Message.authorId(), })

    // Definições da mensagem
    const defs = {
      title: Dictionary.get('profile.createSuccess', _config),
      options: [
        {
          icon: 'home',
          name: Dictionary.get('general.init', _config),
          value: Dictionary.get('general.backStart', _config),
        },
        {
          icon: 'theaterMasks',
          name: Dictionary.get('profile.profile', _config),
          value: Dictionary.get('profile.backProfile', _config),
        },
      ],
    }

    // Pergunta e trata resposta
    _Message.sendPrompt(defs).then(emoji => {
      // Age de acordo com o pedido
      switch (emoji._id) {
        case 'home': require('./Init').main(_Message, _config)
          break
        case 'theaterMasks': this.main(_Message, _config)
          break
      }
    })
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

    // Monta opções dos perfis
    const options = profiles.map((profile, pos) => {
      const option = {
        name: profile.nick || profile.name,
      }

      // Seleciona ícone equivalente
      switch (pos + 1) {
        case 1: option.icon = 'one'
          break
        case 2: option.icon = 'two'
          break
        case 3: option.icon = 'three'
          break
        case 4: option.icon = 'four'
          break
        case 5: option.icon = 'five'
          break
        case 6: option.icon = 'six'
          break
        case 7: option.icon = 'seven'
          break
        case 8: option.icon = 'seveeight'
          break
        case 9: option.icon = 'nine'
          break
        case 10: option.icon = 'ten'
          break
      }

      return option
    })

    // Adiciona opção de página anterior
    options.push({
      icon: 'preview',
      name: Dictionary.get('general.preview', _config, { amount: 10, }),
      value: Dictionary.get('profile.previewPlayers', _config, { amount: 10, }),
      inline: true,
    })

    // Adiciona opção de próxima página
    options.push({
      icon: 'next',
      name: Dictionary.get('general.next', _config),
      value: Dictionary.get('profile.nextPlayers', _config, { amount: 10, }),
      inline: true,
    })

    // Definições
    const defs = {
      title: Dictionary.get('profile.frofilesFound', _config),
      description: (
        profiles.length > 0
          ? Dictionary.get('profile.frofilesFoundDescription', _config)
          : Dictionary.get('profile.frofilesNotFound', _config)
      ),
      options,
    }

    // Envia lista com opções e processa resposta
    _Message.sendPrompt(defs).then(emoji => {
      // Opções numéricas
      const numbers = [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'seveeight', 'nine', 'ten',
      ]

      // Número pedido
      const orderNumber = numbers.indexOf(emoji._id)

      // Se pediu perfil
      if (orderNumber !== -1) {
        // Captura usuário desejado
        const user = _Message.serverMembers().get(profiles[orderNumber].id).user

        // Exibe perfil
        this.view(_Message, _config, [ user, ])

        return
      }

      // Altera parâmetros de acordo com o pedido
      switch (emoji._id) {
        case 'next': _params.page += 1
          break
        case 'preview': _params.page -= 1
      }

      // Busca com novos parâmetros
      this.list(_Message, _config, _params)
    })
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

      // Opções
      const options = [
        {
          icon: 'death',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.ds, }),
        },
        {
          icon: 'island',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.sw, }),
        },
        {
          icon: 'castle',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.ham, }),
        },
        {
          icon: 'ghost',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.dst, }),
        },
      ]

      // Definições
      const defs = {
        title: Dictionary.get('profile.title', _config, { name: user.username, }),
        thumbnail: user.displayAvatarURL(),
        description: content,
        options,
      }

      // Envia perfil básico com opções
      // Se pediu mais detalhes de uma experiência
      _Message.sendPrompt(defs).then(emoji => {
        let version

        // Detecta a versão
        switch (emoji._id) {
          case 'death': version = 'ds'
            break
          case 'island': version = 'sw'
            break
          case 'castle': version = 'ham'
            break
          case 'ghost': version = 'dst'
        }

        // Exibe
        require('./Experience').view(_Message, _config, version, user)
      })
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
  viewMain (_Message, _config, _users) {
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
    // Opções do menu
    const propOptions = [
      {
        icon: 'ticket',
        name: Dictionary.get('profile.name', _config),
        value: Dictionary.get('profile.nameResume', _config),
      },
      {
        icon: 'label',
        name: Dictionary.get('profile.nick', _config),
        value: Dictionary.get('profile.nickResume', _config),
      },
      {
        icon: 'genre',
        name: Dictionary.get('profile.genre', _config),
        value: Dictionary.get('profile.genreResume', _config),
      },
      {
        icon: 'cake',
        name: Dictionary.get('profile.age', _config),
        value: Dictionary.get('profile.ageResume', _config),
      },
      {
        icon: 'city',
        name: Dictionary.get('profile.city', _config),
        value: Dictionary.get('profile.cityResume', _config),
      },
      {
        icon: 'road',
        name: Dictionary.get('profile.state', _config),
        value: Dictionary.get('profile.stateResume', _config),
      },
      {
        icon: 'country',
        name: Dictionary.get('profile.country', _config),
        value: Dictionary.get('profile.countryResume', _config),
      },
      {
        icon: 'death',
        name: Dictionary.get('experience.experienceIn', _config, { version: versions.ds, }),
        value: Dictionary.get(
          'experience.experienceInResume', _config, { version: versions.ds, }
        ),
      },
      {
        icon: 'island',
        name: Dictionary.get('experience.experienceIn', _config, { version: versions.sw, }),
        value: Dictionary.get(
          'experience.experienceInResume', _config, { version: versions.sw, }
        ),
      },
      {
        icon: 'castle',
        name: Dictionary.get('experience.experienceIn', _config, { version: versions.ham, }),
        value: Dictionary.get(
          'experience.experienceInResume', _config, { version: versions.ham, }
        ),
      },
      {
        icon: 'ghost',
        name: Dictionary.get('experience.experienceIn', _config, { version: versions.dst, }),
        value: Dictionary.get(
          'experience.experienceInResume', _config, { version: versions.dst, }
        ),
      },
    ]

    // Defnições do menu
    const defs = {
      title: Dictionary.get('profile.editAsk', _config),
      options: propOptions,
    }

    // Envia menu e executa comando desejado
    const emoji = await _Message.sendPrompt(defs)

    // Propriedade a ser atualizada
    let prop

    // Converte nome do emoji para nome da propriedade
    // Se não estiver na lista é porque nomes são iguais
    switch (emoji._id) {
      case 'ticket': prop = 'name'
        break
      case 'label': prop = 'nick'
        break
      case 'cake': prop = 'birth'
        break
      case 'road': prop = 'state'
        break
      case 'death': prop = 'ds'
        break
      case 'island': prop = 'sw'
        break
      case 'castle': prop = 'ham'
        break
      case 'ghost': prop = 'dst'
        break
      case 'ghost': prop = 'dst'
        break
      default: prop = emoji._id
    }

    // Se propriedade é uma versão, envia pra atualização de experiência e finaliza
    if (Object.keys(versions).indexOf(prop) >= 0) {
      require('./Experience').edit(_Message, _config, prop)

      return
    }

    // Dados a serem atualizados
    const data = { id: _Message.authorId(), }

    // Atualiza
    return ProfileService.updateProp(prop, data, _Message, _config)
      .then(response => {
        return Dictionary.get(`profile.${prop}UpdateSuccess`, _config)
      })
      .catch(e => {
        return Dictionary.get(`profile.${prop}UpdateError`, _config)
      })
      .then(async title => { // Menu
        const defs = {
          title: title,
          options: [
            {
              icon: 'home',
              name: Dictionary.get('general.init', _config),
              value: Dictionary.get('general.backStart', _config),
            },
            {
              icon: 'theaterMasks',
              name: Dictionary.get('profile.profile', _config),
              value: Dictionary.get('profile.backProfile', _config),
            },
          ],
        }

        const emoji = await _Message.sendPrompt(defs, _config)

        switch (emoji._id) {
          case 'home': require('./Init').main(_Message, _config)
            break
          case 'theaterMasks': this.main(_Message, _config)
        }
      })
  }
}

module.exports = new Profile()