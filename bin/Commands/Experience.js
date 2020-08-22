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

    // Envia perfil básico com opções
    // Se pediu mais detalhes de uma experiência
    _Message.sendPrompt({
      title: Dictionary.get(
        'experience.title', _config, { name: _user.username, version: versions[_version], }
      ),
      thumbnail: _user.displayAvatarURL(),
      description: content,
      options: [
        {
          icon: 'death',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.ds, }),
          callback: () => this.view(_Message, _config, 'ds', _user),
        },
        {
          icon: 'island',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.sw, }),
          callback: () => this.view(_Message, _config, 'sw', _user),
        },
        {
          icon: 'castle',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.ham, }),
          callback: () => this.view(_Message, _config, 'ham', _user),
        },
        {
          icon: 'ghost',
          name: Dictionary.get('experience.experienceIn', _config, { version: versions.dst, }),
          callback: () => this.view(_Message, _config, 'dst', _user),
        },
        require('./Profile').options.backProfile(
          _Message, _config, _Message.serverMembers().get(experience.user).user
        ),
        require('./Profile').options.backProfileModule(_Message, _config),
        require('./Init').options.backStart(_Message, _config),
      ],
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
  edit (_Message, _config, _version) {
    const update = _prop => {
      // Dados a serem atualizados
      const data = { id: _Message.authorId(), }

      // Atualiza
      return ExperienceService.updateProp(_prop, data, _Message, _config, versionParams)
        .then(response => {
          return Dictionary.get(`experience.${_prop}UpdateSuccess`, _config)
        })
        .catch(e => {
          return Dictionary.get(`experience.${_prop}UpdateError`, _config)
        })
        .then(title => { // Menu
          _Message.sendPrompt({
            title: title,
            options: [
              {
                icon: 'dramaMasks',
                name: Dictionary.get('profile.profile', _config),
                value: Dictionary.get('profile.backProfileModule', _config),
                callback: () => require('./Profile').main(_Message, _config),
              },
              {
                icon: 'home',
                name: Dictionary.get('general.init', _config),
                value: Dictionary.get('general.backStart', _config),
                callback: () => require('./Init').main(_Message, _config),
              },
            ],
          }, _config)
        })
    }

    // Parâmetros da mensagem
    const versionParams = { version: versions[_version], }

    _Message.sendPrompt({
      title: Dictionary.get('experience.editAsk', _config, versionParams),
      options: [
        {
          icon: 'cd',
          name: Dictionary.get('experience.have', _config),
          value: Dictionary.get('experience.haveResume', _config, versionParams),
          callback: () => update('have'),
        },
        {
          icon: 'joystick',
          name: Dictionary.get('experience.platform', _config),
          value: Dictionary.get('experience.platformResume', _config, versionParams),
          callback: () => update('platform'),
        },
        {
          icon: 'clock',
          name: Dictionary.get('experience.hours', _config),
          value: Dictionary.get('experience.hoursResume', _config, versionParams),
          callback: () => update('hours'),
        },
        {
          icon: 'mage',
          name: Dictionary.get('experience.main', _config),
          value: Dictionary.get('experience.mainResume', _config, versionParams),
          callback: () => update('main'),
        },
        {
          icon: 'calendarCheck',
          name: Dictionary.get('experience.survived', _config),
          value: Dictionary.get('experience.survivedResume', _config, versionParams),
          callback: () => update('survived'),
        },
        {
          icon: 'medal',
          name: Dictionary.get('experience.level', _config),
          value: Dictionary.get('experience.levelResume', _config, versionParams),
          callback: () => update('level'),
        },
        require('./Profile').options.backProfileModule(_Message, _config),
        require('./Init').options.backStart(_Message, _config),
      ],
    })
  }
}

module.exports = new Experience()