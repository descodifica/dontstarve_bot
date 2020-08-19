// Calcula idade
const { AgeFromDate, } = require('age-calculator')

// Importa versões
const versions = require('../../versions')

// Importa comando padrão
const DefaultCommand = require('../Default')

// Importa serviço padrão de perfil
const ProfileService = require('../../Services/Profile')

// O comando de perfis
class Profile extends DefaultCommand {
  /**
   * @description Cria perfil do usário
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async create (_Message, _config) {
    await ProfileService.create({ id: _Message.authorId(), })

    _Message.sendFromDictionary('profile.createSuccess', _config)
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
        this.view(_Message, _config, user)

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
   * @description Ver perfil de alguem
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {Array} _users Usuários a terem perfil exibido
   */
  async view (_Message, _config, _users) {
    // Lista de usuários
    const usersList = _users.array ? _users.array() : [ _users, ]

    // Id de todos os usuários
    const ids = usersList.map(i => i.id)

    // Busca perfis
    const profiles = await ProfileService.list({ where: { id: { type: 'IN', value: ids, }, }, })

    // Ids dos perfis encontrados
    const foundIds = profiles.map(i => i.id)

    // Ids dos perfis não encontrados
    const unfoundIds = ids.filter(id => foundIds.indexOf(id) === -1)

    // Exibe perfis
    profiles.map(profile => {
      // Captura dados do usuário
      const user = _users.get ? _users.get(profile.id) : _users

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
          name: Dictionary.get('experience.experiencein', _config, { version: versions.ds, }),
        },
        {
          icon: 'island',
          name: Dictionary.get('experience.experiencein', _config, { version: versions.sw, }),
        },
        {
          icon: 'castle',
          name: Dictionary.get('experience.experiencein', _config, { version: versions.ham, }),
        },
        {
          icon: 'ghost',
          name: Dictionary.get('experience.experiencein', _config, { version: versions.dst, }),
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
        require('../Experience').view(_Message, _config, version, user)
      })
    })

    // Informa perfis não encontrados
    unfoundIds.map(id => {
      const user = _users.get ? _users.get(id) : _users

      _Message.sendEmbedMessage({
        title: user.username,
        thumbnail: user.displayAvatarURL(),
        description: Dictionary.get('profile.profileNotCreated', _config),
      })
    })
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
  edit (_Message, _config, _prop, _version) {
    return ProfileService.updateProp(
      _prop, { id: _Message.authorId(), version: _version, }, _Message, _config
    )
  }
}

module.exports = new Profile()