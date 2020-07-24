// Percorre todos os campos de um json
const objectMap = require('object.map')

// Calcula idade
const { AgeFromDate, } = require('age-calculator')

// Serviços
const ProfileService = require('../entities/Profile')
const ExperienceService = require('../entities/Experience')

// Importa comando padrão
const DefaultCommand = require('./Default')

// O comando de Perfil
class Profile extends DefaultCommand {
  /**
   * @description Visualiza um perfil
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  main (_args, _message, _config) {
    this.view(_args, _message, _config)
  }

  /**
   * @description Visualiza um perfil
   * @param {Array} _args Os argumentos passados
   * @param {Object} _message O objeto da mensagem
   * @param {Object} _config As configurações do servidor
   */
  async view (_args, _message, _config) {
    // Id do autor
    const authorId = this.authorId(_message)

    // Busca o perfil
    let profile = await ProfileService.get(authorId)

    // Se não achou, cria e busca novamente
    if (!profile) {
      await ProfileService.create({ id: authorId, })

      profile = await ProfileService.get(authorId)
    }

    // Adiciona posição de experiências
    profile.experiences = {}

    // Busca experiências
    const experiences = await ExperienceService.getBy({ user: authorId, })

    // Organiza experiências por versão do jogo
    experiences.map(data => profile.experiences[data.version] = data)

    // Experiencias não encontradas viram objeto vazio
    profile.experiences.DS = profile.experiences.DS || {}
    profile.experiences.SW = profile.experiences.SW || {}
    profile.experiences.HAM = profile.experiences.HAM || {}
    profile.experiences.DST = profile.experiences.DST || {}

    // Formata informações das experiências
    profile.experiences = objectMap(profile.experiences, version => {
      return objectMap(version, (v, k) => {
        if (k === 'level') {
          switch (v) {
            case 1: v = 'Abduzido - Acabou de começar'
              break
            case 2: v = 'Faminto - Sobreviveu por menos de 1 ano e/ou ainda sabe pouco'
              break
            case 3: v = 'Explorador - Já sobreviveu por pelo menos 1 ano... mas não conhece ' +
                'muito do jogo'
              break
            case 4: v = 'Explorador - Já sobreviveu por pelo menos 1 ano... mas não conhece ' +
              'muito do jogo'
              break
            case 5: v = 'Mochileiro - Já sobreviveu por pelo menos 1 ano e tem um conhecimento ' +
              'razoável do jogo'
              break
            case 6: v = 'Constantiano - Já sobreviveu por pelo menos 5 anos e tem um ' +
              'conhecimento mediano do jogo'
              break
            case 7: v = 'Amigo da Charlie - Já sobreviveu por pelo menos 7 anos e tem um ' +
              'conhecimento mediano do jogo'
              break
            case 8: v = 'Rei do Constant- Já sobreviveu por pelo menos 7 anos e tem um ' +
              'conhecimento avançado do jogo'
              break
            case 9: v = 'Aliado de "Eles" - Já sobreviveu por pelo menos 10 anos e tem um ' +
              'conhecimento total ou quase total do jogo'
          }
        }

        return v
      })
    })

    console.log(profile.experiences)

    // Função de tratamento de não informado
    const getValOrNotDefined = (_val, _c = v => v) => _val ? _c(_val) : '[?]'

    // Informações básicas
    let content = [
      `***Nome:*** ${getValOrNotDefined(profile.name)}`,
      `***Nick:*** ${getValOrNotDefined(profile.nick)}`,
      `***Idade:***  ${getValOrNotDefined(profile.birth, v => new AgeFromDate(v).age + ' anos')}`,
      `***Localização:***  ${getValOrNotDefined(profile.city)}/` +
        `${getValOrNotDefined(profile.state)} - ${getValOrNotDefined(profile.country)}`,
    ]

    // Versões
    const versions = [
      [ 'DS', 'Solo', ], [ 'SW', 'Shipwrecked', ], [ 'HAM', 'Hamlet', ], [ 'DST', 'Together', ],
    ]

    // Informações das versões
    versions.map(([ initials, name, ]) => {
      content = content.concat([
        `\n***Don\'t Starve ${name}***\n`,
        `***Possui?*** ${getValOrNotDefined(profile.experiences[initials].have, v => {
          return v === '1' ? 'Sim' : 'Não'
        })}`,
        `***Plataforma?*** ${getValOrNotDefined(profile.experiences[initials].platform)}`,
        `***Horas Jogadas?*** ${getValOrNotDefined(profile.experiences[initials].hours)}`,
        `***Main?*** ${getValOrNotDefined(profile.experiences[initials].main)}`,
        `***Sobreviveu por:*** ${getValOrNotDefined(profile.experiences[initials].survived)} dias`,
        `***Nível:*** ${getValOrNotDefined(profile.experiences[initials].level)}`,

      ])
    })

    // A mensagem
    const embed = this.embedMessage({
      title: '> Perfil de ' + this.authorUserName(_message),
      description: content.join('\n'),
      thumbnail: this.authorAvatar(_message),
    }, _message)

    // Respode
    _message.reply(embed)
  }
}

module.exports = new Profile()