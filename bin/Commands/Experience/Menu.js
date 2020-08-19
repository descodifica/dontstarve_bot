// Versões do jogo
const versions = require('../../versions')

// Menu padrão
const Menu = require('../Menu')

/**
 * @description Menu do comando de perfis
 */
class ExperienceMenu extends Menu {
  /**
   * @description Editar a experiência
   * @param {Object} _Message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   * @param {String} _version A versão a ter experiência editada
   */
  edit (_Message, _config, _version) {
    // Opções do menu
    const options = [
      {
        icon: 'cd',
        name: Dictionary.get('experience.have', _config),
        inline: true,
      },
      {
        icon: 'joystick',
        name: Dictionary.get('experience.platform', _config),
        inline: true,
      },
      {
        icon: 'clock',
        name: Dictionary.get('experience.hours', _config),
        inline: true,
      },
      {
        icon: 'mage',
        name: Dictionary.get('experience.main', _config),
        inline: true,
      },
      {
        icon: 'calendarCheck',
        name: Dictionary.get('experience.survived', _config),
        inline: true,
      },
      {
        icon: 'medal',
        name: Dictionary.get('experience.level', _config),
        inline: true,
      },
    ]

    // Defnições do menu
    const defs = {
      title: Dictionary.get('experience.editAsk', _config, { version: versions[_version], }),
      options,
    }

    // Envia menu e executa comando desejado
    _Message.sendPrompt(defs).then(emoji => {
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

      this.module.edit(_Message, _config, prop, _version)
    })
  }
}

module.exports = _module => new ExperienceMenu(_module)