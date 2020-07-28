// Adiciona formato de data para brasil ao dicionário
global.Dictionary.dateFormat('ptbr', { day: 0, month: 1, year: 2, sep: '/', })

// Adiciona sessão para portugês do brasil ao dicionário
global.Dictionary.add('ptbr', {
  config: {
    name: 'config',
    resume: 'Configura o bot no servidor (somente dono do servidor)',
    methods: {
      lang: {
        name: 'ling',
        resume: 'Altera o idioma do Bot',
        doc: [
          'Aceita os valores:\n',
          '> de - Alemão',
          '> en - Inglês',
          '> es - Espanhol',
          '> fr - Francês',
          '> it - Italiano',
          '> ptbr - Portugês do Brasil',
          '> zhcn - Chinês Simplificado',
        ],
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `o idioma "${lang}" é inválido. ` +
        `Valores aceitos são: ${firstLangs} e ${lastLang}`,
      UPDATED_LANGUAGE: 'idioma atualizado com sucesso',
      UPDATE_LANGUAGE_ERROR: 'ocorreu um problema ao mudar o idioma',
    },
  },
  general: {
    messages: {
      COMMAND_NOT_FOUND: ({ command, }) => `comando "${command}" não existe`,
      METHOD_NOT_EXISTS: ({ method, }) => `método "${method}" não existe`,
      OWNER_CONTROL_ONLY: 'esse comando só pode ser usado pelo dono do servidor!',
      COMMAND_METHOD_REQUIRED: 'É necessário passar um método para o comando. Entre com o ' +
        'comando de ajuda para maiores detalhes',
      METHODS: 'métodos',
      METHOD: 'método',
      COMMANDS: 'comandos',
      COMMAND: 'comando',
      YEARS: 'anos',
      YES: 'Sim',
      NO: 'Não',
    },
  },
  help: {
    name: 'ajuda',
    resume: 'Busca ajuda do bot e de seus comandos',
    messages: {
      COMMAND_NOT_FOUND: ({ command, prefix, }) => `o comando "${command}" não existe, entre ` +
        `"${prefix}ajuda" para ver todos os comandos`,
      METHOD_NOT_FOUND: ({ method, }) => `Método "${method}" não encontrado`,
      VIEW_MORE_INFO: ({ prefix, command, method, }) => `Veja maiores informações de ${prefix}` +
       `${command} ${method}:`,
      NO_INFO_AVAILABLE: 'Nenhuma informação extra disponível',
      VIEW_ALL: ({ word, }) => `veja aqui uma lista de todos os ${word} disponíveis`,
      VIEW_MORE_DETAILS: ({ command, word, }) => `Entre "${command}" seguido de um ${word} para ` +
        'ter maiores detalhes',
    },
  },
  profile: {
    name: 'perfil',
    resume: 'Perfil dos usuários',
    methods: {
      view: {
        name: 'ver',
        resume: 'Vizualiza um perfil',
      },
      edit: {
        name: 'editar',
        resume: 'Edita uma informação do perfil',
        params: {
          name: 'nome',
          birth: 'nascimento',
          city: 'cidade',
          state: 'estado',
          country: 'pais',
        },
      },
    },
    messages: {
      CREATE: ({ prefix, }) => `seu perfil acabou de ser criado! Entre ${prefix}ajuda perfil  ` +
      'editar para saber editar ele!',
      CREATE_ERROR: 'ocorreu um erro ao criar o seu perfil',
      UPDATE: 'perfil atualizado',
      UPDATE_ERROR: 'ocorreu um erro ao atualizar uma ou mais informações do perfil',
      NO_PROFILE: ({ user, }) => `***${user}*** não possui um perfil ainda!`,
      PROFILE_NAME: 'Nome',
      PROFILE_NICK: 'Nick',
      PROFILE_AGE: 'Idade',
      PROFILE_LOCATE: 'Localização',
      PROFILE_HAVE: 'Possui',
      PROFILE_PLATFORM: 'Plataforma',
      PROFILE_HOURS_PLAYED: 'Horas Jogadas',
      PROFILE_SURVIVED: 'Sobreviveu por',
      PROFILE_LEVEL: 'Nível',
      PROFILE_PROFILE: ({ name, }) => 'Perfil de ' + name,
      DAYS: 'dias',
      ABDUCTED_TEXT: 'Abduzido - Acabou de começar',
      HUNGRY_TEXT: 'Faminto - Sobreviveu por menos de 1 ano e/ou a inda sabe pouco',
      EXPLORER_TEXT: 'Explorador - Já sobreviveu por pelo menos 1 ano... mas não conhece muito ' +
        'do jogo',
      SURVIVOR_TEXT: 'Sobrevivente - Já sobreviveu por pelo menos 1 ano e tem um conhecimento ' +
        'básico do jogo',
      BACKPACKER_TEXT: 'Mochileiro - Já sobreviveu por pelo menos 1 ano e tem um conhecimento ' +
        'razoável do jogo',
      CONSTANTIAN_TEXT: 'Constantiano - Já sobreviveu por pelo menos 5 anos e tem um ' +
        'conhecimento mediano do jogo',
      CHARLIES_FRIEND_TEXT: 'Amigo da Charlie - Já sobreviveu por pelo menos 7 anos e tem um ' +
        'conhecimento mediano do jogo',
      KING_OF_CONSTANT_TEXT: 'Rei do Constant- Já sobreviveu por pelo menos 7 anos e tem um ' +
        'conhecimento avançado do jogo',
      ALLY_OF_THEY_TEXT: 'Aliado de "Eles" - Já sobreviveu por pelo menos 10 anos e tem um ' +
        'conhecimento total ou quase total do jogo',

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
          level: 'nivel',
        },
      },
    },
  },
})