// Adiciona sessão para portugês do brasil ao dicionário
Dictionary.add('ptbr', {
  name: 'Portugês do Brasil',
  flag: '🇧🇷',
  dateFormat: { day: 0, month: 1, year: 2, sep: '/', },
  texts: {
    config: {
      name: 'config',
      resume: 'Configura o Bot no servidor (somente dono do servidor)',
      methods: {
        lang: {
          name: 'ling',
          resume: 'Altera o idioma do Bot',
        },
        prefix: {
          name: 'prefix',
          resume: 'Altera o prefixo do Bot',
        },
      },
      messages: {
        INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `O idioma "${lang}" é inválido. ` +
          `Valores aceitos são: ${firstLangs} e ${lastLang}`,
        UPDATED_LANGUAGE: 'Idioma atualizado com sucesso',
        UPDATE_LANGUAGE_ERROR: 'Ocorreu um problema ao mudar o idioma',
        UPDATED_PREFIX: 'Prefixo atualizado com sucesso',
        UPDATE_PREFIX_ERROR: 'Ocorreu um problema ao mudar o prefixo',
      },
    },
    experience: {
      methods: {
        edit: {
          params: {
            version: 'versao',
            have: 'possui',
            platform: 'plataforma',
            hours: 'horas',
            main: 'main',
            survived: 'sobreviveu',
            level: 'rank',
          },
        },
      },
    },
    general: {
      messages: {
        COMMAND_NOT_FOUND: ({ command, }) => `Comando \`${command}\` não existe`,
        METHOD_NOT_EXISTS: ({ method, }) => `Método \`${method}\` não existe`,
        OWNER_CONTROL_ONLY: 'Esse comando só pode ser usado pelo dono do servidor!',
        COMMAND_METHOD_REQUIRED: 'É necessário passar um método para o comando. Entre com o ' +
          'comando de ajuda para maiores detalhes',
        METHODS: 'métodos',
        METHOD: 'método',
        COMMANDS: 'comandos',
        COMMAND: 'comando',
        YEARS: 'anos',
        YES: 'Sim',
        NO: 'Não',
        INVALID_OPTION: ({ prop, options, lastOption, }) => 'Valor inválido para a propriedade ' +
          `${prop}. Valores aceitos são ${options} e ${lastOption}`,
        INVALID_DATE: ({ prop, }) => `Data inválida para a propriedade ${prop}`,
        LONG_TEXT: ({ prop, }) => `Valor muito longo para a propriedade ${prop}`,
        INVALID_INTEGER: ({ prop, }) => `Propriedade ${prop} deve ser um valor inteiro`,
        INVALID_RELATION: ({ prop, options, lastOption, }) => 'Valor inválido para a propriedade ' +
        `${prop}. Valores aceitos são ${options} e ${lastOption}`,
        WELCOME: ({ userName, serverName, }, { prefix, }) => {
          return (
            `🇧🇷 Olá **${userName}**! Fico realmente feliz que esteja me utilizando no seu ` +
            `servidor **${serverName}**, espero de verdade que você curta a experiência :D.\n\n` +
           `Então vamos começar? No seu servidor entre com o comando \`${prefix}ajuda\` para ` +
           'obter uma lista de todos os comandos dispníveis e como usá-los.\n\n'
          )
        },
      },
    },
    help: {
      name: 'ajuda',
      resume: 'Busca ajuda do Bot e de seus comandos',
      messages: {
        COMMAND_NOT_FOUND: ({ command, }, { prefix, }) => `O comando \`${command}\` não existe, ` +
          `entre \`${prefix}ajuda\` para ver todos os comandos`,
        METHOD_NOT_FOUND: ({ method, }) => `Método \`${method}\` não encontrado`,
        NO_INFO_AVAILABLE: '__***Nenhuma informação extra disponível***__',
        WELCOME: ({ word, }) => {
          return 'Bem vindo a ajuda do Bot de ***Don\'t Starve*** para o ***DISCORD***!\n\n' +
          'Espero que seja inutitivo, então vamos começar! '
        },
        VIEW_ALL_COMMANDS: (p, { prefix, }) => {
          return (
            `Entre como o prefixo do Bot (por padrão é \`${prefix}\`) seguido de um comando para ` +
              'executá-lo, simples assim!\n\n' +
              'Veja abaixo uma lista descritiva de todos os comandos possíveis:\n\n'
          )
        },
        VIEW_ALL_METHODS: ({ command, }, { prefix, }) => {
          return (
            `Entre com o comando \`${command}\` seguido de seu ` +
              'método para executá-lo, simples assim!\n\n'
          )
        },
        VIEW_MORE_DETAILS: ({ command, word, }, { prefix, }) => {
          return (
            `Quer mais detalhes? Entre \`${command}\` seguido de um ${word}!\n\n` +
            `Quer aprender do inicio? Entre \`${prefix}ajuda\`!`
          )
        },
      },
    },
    profile: {
      name: 'perfil',
      resume: 'Perfil dos Jogadores',
      methods: {
        view: {
          name: 'ver',
          resume: 'Vizualiza o perfil o seu perfil ou de outros jogadores',
        },
        edit: {
          name: 'editar',
          resume: 'Edita informações do perfil',
          params: {
            name: 'nome',
            nick: 'nick',
            birth: 'nascimento',
            city: 'cidade',
            state: 'estado',
            country: 'pais',
            genre: 'genero',
          },
        },
      },
      messages: {
        UPDATE: 'Perfil atualizado',
        UPDATE_ERROR: 'Ocorreram problemas ao atualizar uma ou mais informações do perfil',
        PROFILE_NAME: 'Nome',
        PROFILE_NICK: 'Nick',
        PROFILE_AGE: 'Idade',
        PROFILE_GENRE: 'Gênero',
        PROFILE_LOCATE: 'Localização',
        PROFILE_HAVE: 'Possui',
        PROFILE_PLATFORM: 'Plataforma',
        PROFILE_HOURS_PLAYED: 'Horas Jogadas',
        PROFILE_SURVIVED: 'Sobreviveu por',
        PROFILE_LEVEL: 'Rank',
        PROFILE_PROFILE: ({ name, }) => 'Perfil de ' + name,
        DAYS: 'dias',
        ABDUCTED_TEXT: '*Abduzido* - Acabou de começar',
        HUNGRY_TEXT: 'Faminto - Sobreviveu por menos de 1 ano e/ou ainda sabe pouco',
        EXPLORER_TEXT: '*Explorador* - Já sobreviveu por pelo menos 1 ano... mas não conhece ' +
          'muito do jogo',
        SURVIVOR_TEXT: '*Sobrevivente* - Já sobreviveu por pelo menos 1 ano e tem um ' +
          'conhecimento básico do jogo',
        BACKPACKER_TEXT: '*Mochileiro* - Já sobreviveu por pelo menos 1 ano e tem um ' +
          'conhecimento razoável do jogo',
        CONSTANTIAN_TEXT: '*Constantiano* - Já sobreviveu por pelo menos 5 anos e tem um ' +
          'conhecimento mediano do jogo',
        CHARLIES_FRIEND_TEXT: '*Amigo da Charlie* - Já sobreviveu por pelo menos 7 anos e tem um ' +
          'conhecimento mediano do jogo',
        KING_OF_CONSTANT_TEXT: '*Rei do Constant*- Já sobreviveu por pelo menos 7 anos e tem um ' +
          'conhecimento avançado do jogo',
        ALLY_OF_THEM_TEXT: '*Aliado de "Eles"* - Já sobreviveu por pelo menos 10 anos e tem um ' +
          'conhecimento total ou quase total do jogo',

      },
    },
    stream: {
      name: 'stream',
      resume: 'Lista canais de Streamers focados em Don\'t Starve',
    },
  },
})