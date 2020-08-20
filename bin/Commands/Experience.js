// Importa comando padrão
const DefaultCommand = require('./Default')

// Importa entidade padrão de experienca
const ExperienceService = require('../Services/Experience')

// Importa versões
const versions = require('../versions')

// Níveis de rank
const levels = [
  'allyOfThem', 'kingOfConstant', 'charliesFriend', 'constantian', 'backpacker', 'survivor',
  'explorer', 'hungry', 'abducted',
]

// O comando de Experiência
class Experience extends DefaultCommand {
  /**
   * @description Ver experiência de alguem
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {String} _version Versão desejada
   * @param {Object} _user Usuário a ter perfil exibido
   */
  async view (_Message, _config, _version, _user) {
    // Busca a experiência
    const experience = (await ExperienceService.getBy({ user: _user.id, version: _version, }))[0]

    // Monta conteúdo da experiência
    const content = (
      this.mountExperience(experience, _config) +
      '\n\n' +
      Dictionary.get('experience.moreInformation', _config, {}, { bold: true, })
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
      {
        icon: 'eye',
        name: Dictionary.get('profile.profile', _config),
        value: Dictionary.get('profile.backProfile', _config),
      },
      {
        icon: 'theaterMasks',
        name: Dictionary.get('profile.profile', _config),
        value: Dictionary.get('profile.backProfileModule', _config),
      },
      {
        icon: 'home',
        name: Dictionary.get('general.init', _config),
        value: Dictionary.get('general.backStart', _config),
      },
    ]

    // Definições
    const defs = {
      title: Dictionary.get(
        'experience.title', _config, { name: _user.username, version: versions[_version], }
      ),
      thumbnail: _user.displayAvatarURL(),
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
          break
        case 'home': {
          require('./Init').main(_Message, _config)

          return
        }
        case 'theaterMasks': {
          require('./Profile').main(_Message, _config)

          return
        }
        case 'eye': {
          require('./Profile').view(
            _Message, _config, [ _Message.serverMembers().get(experience.user).user, ]
          )

          return
        }
      }

      this.view(_Message, _config, version, _user)
    })
  }

  /**
   * @description Retorna o conteúdo da experiência
   * @param {Object} _experience A experiência
   * @param {Object} _config As configurações do servidor
   * @returns {String}
   */
  mountExperience (_experience, _config) {
    const description = []

    // Dados da experiência
    const experience = { ..._experience, }

    // Remove dados não relacionados a experiência exibida
    delete experience.id
    delete experience.user
    delete experience.version

    // Se não achou dados, informa
    if (Object.values(experience).filter(i => i).length === 0) {
      description.push(Dictionary.get('experience.noInformation', _config, {}, { italic: true, }))
    }
    else {
      const labelFormat = { label: true, }
      if (_experience.have) {
        description.push(
          Dictionary.get('experience.have', _config, {}, labelFormat) +
          Dictionary.get(`general.${_experience.have === 1 ? 'yes' : 'no'}`, _config)
        )
      }

      if (_experience.platform) {
        description.push(
          Dictionary.get('experience.platform', _config, {}, labelFormat) + _experience.platform
        )
      }

      if (_experience.hours) {
        description.push(
          Dictionary.get('experience.hours', _config, {}, labelFormat) +
          _experience.hours +
          ' ' +
          Dictionary.get('experience.hours', _config).toLowerCase()
        )
      }

      if (_experience.main) {
        description.push(
          Dictionary.get('experience.main', _config, {}, labelFormat) + _experience.main
        )
      }

      if (_experience.survived) {
        description.push(
          Dictionary.get('experience.survived', _config, {}, labelFormat) + _experience.survived +
          ' ' + Dictionary.get('experience.days', _config).toLowerCase()
        )
      }

      if (_experience.level) {
        const level = levels[_experience.level - 1]

        description.push(
          Dictionary.get('experience.level', _config, {}, labelFormat) +
          Dictionary.get('experience.' + level + 'Name', _config, {}, { bold: true, }) +
          ' - ' +
          Dictionary.get('experience.' + level + 'Resume', _config)
        )
      }
    }

    return description.join('\n')
  }

  /**
   * @description Atualiza uma propriedade
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {String} _version Versão a ser atualizada
   */
  async edit (_Message, _config, _version) {
    // Parâmetros da mensagem
    const versionParams = { version: versions[_version], }

    // Opções do menu
    const propOptions = [
      {
        icon: 'cd',
        name: Dictionary.get('experience.have', _config),
        value: Dictionary.get('experience.haveResume', _config, versionParams),
      },
      {
        icon: 'joystick',
        name: Dictionary.get('experience.platform', _config),
        value: Dictionary.get('experience.platformResume', _config, versionParams),
      },
      {
        icon: 'clock',
        name: Dictionary.get('experience.hours', _config),
        value: Dictionary.get('experience.hoursResume', _config, versionParams),
      },
      {
        icon: 'mage',
        name: Dictionary.get('experience.main', _config),
        value: Dictionary.get('experience.mainResume', _config, versionParams),
      },
      {
        icon: 'calendarCheck',
        name: Dictionary.get('experience.survived', _config),
        value: Dictionary.get('experience.survivedResume', _config, versionParams),
      },
      {
        icon: 'medal',
        name: Dictionary.get('experience.level', _config),
        value: Dictionary.get('experience.levelResume', _config, versionParams),
      },
    ]

    // Defnições do menu
    const defs = {
      title: Dictionary.get('experience.editAsk', _config, versionParams),
      options: propOptions,
    }

    // Envia menu e executa comando desejado
    const emoji = await _Message.sendPrompt(defs)

    // Propriedade pedida
    let prop

    // Converte nome do emoji para nome da propriedade
    switch (emoji._id) {
      case 'cd': prop = 'have'
        break
      case 'joystick': prop = 'platform'
        break
      case 'clock': prop = 'hours'
        break
      case 'mage': prop = 'main'
        break
      case 'calendarCheck': prop = 'survived'
        break
      case 'medal': prop = 'level'
    }

    // Dados a serem atualizados
    const data = { id: _Message.authorId(), }

    // Atualiza
    return ExperienceService.updateProp(prop, data, _Message, _config, versionParams)
      .then(response => {
        return Dictionary.get(`experience.${prop}UpdateSuccess`, _config)
      })
      .catch(e => {
        return Dictionary.get(`experience.${prop}UpdateError`, _config)
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
              value: Dictionary.get('profile.backProfileModule', _config),
            },
          ],
        }

        const emoji = await _Message.sendPrompt(defs, _config)

        switch (emoji._id) {
          case 'home': require('./Init').main(_Message, _config)
            break
          case 'theaterMasks': require('./Profile').main(_Message, _config)
        }
      })
  }
}

module.exports = new Experience()