// Versões do jogo
const versions = require('../../versions')

// Menu padrão
const Menu = require('../Menu')

// Importa serviço padrão de perfil
const ProfileService = require('../../Services/Profile')

/**
 * @description Menu do comando de perfis
 */
class ProfileMenu extends Menu {
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
        case 'new': this.module.create(_Message, _config)
          break
        case 'user': this.module.view(_Message, _config, _Message.author())
          break
        case 'pencil': this.edit(_Message, _config)
          break
        case 'magnifyingGlass': this.module.list(_Message, _config)
          break
        case 'eye': this.view(_Message, _config)
      }
    })
  }

  /**
   * @description Ver perfil de alguem
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  view (_Message, _config) {
    // Pergunta e trata resposta
    _Message.ask(Dictionary.get('profile.whichProfileSee', _config)).then(response => {
      // Captura usuários mencionados
      const users = response.mentions().users

      // Executa método
      this.module.view(_Message, _config, users)
    })
  }

  /**
   * @description Editar o perfil
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  edit (_Message, _config) {
    // Opções do menu
    const options = [
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
      options,
    }

    // Envia menu e executa comando desejado
    _Message.sendPrompt(defs).then(emoji => {
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

      // Se propriedade não é uma versão, atualiza
      // Se não, envia pra atualização de experiência
      if (Object.keys(versions).indexOf(prop) === -1) {
        this.module.edit(_Message, _config, prop)
      }
      else {
        require('../Experience').Menu.edit(_Message, _config, prop)
      }
    })
  }
}

module.exports = _module => new ProfileMenu(_module)