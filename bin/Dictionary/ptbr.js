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
        HELP_ACCEPT_VALUES: 'Aceita os valores:',
        HELP_ABOUT_PREFIX: (p, { prefix, }) => {
          return (
            'Prefixo é o texto informado antes de um comando para que o Bot saiba que é para ' +
              'ele. Por padrão usamos o prefixo `:ds` e atualmente este servidor esta ' +
              `configurado para usar o prefixo \`${prefix}\`, mas você pode alterá-lo com este ` +
              'comando.'
          )
        },
      },
    },
    experience: {
      messages: {
        HELP_PROFILE_ABOUT_HAVE_PARAM: 'Define se o jogador possui esta versão do jogo.',
        HELP_PROFILE_ABOUT_PLATFORM_PARAM: 'Define em qual plataforma o jogador possui esta ' +
          'versão do jogo.',
        HELP_PROFILE_ABOUT_HOURS_PARAM: 'Define o número de horas do jogador nesta versão do jogo.',
        HELP_PROFILE_ABOUT_MAIN_PARAM: 'Define se o jogador é "Main" de algum personagem.',
        HELP_ABOUT_CHARACTER_ONLY: 'Aceita somente os nomes dos personagens.',
        ACCEPT_CHARACTER_ONLY: 'Aceita somente os nomes dos personagens.',
        HELP_PROFILE_ABOUT_SURVIVED_PARAM: 'Define quantos dias no maximo o jogador conseguiu ' +
          'sobreviver nesta versão do jogo',
        HELP_PROFILE_ABOUT_RANK_PARAM: 'Define o rank do jogador nesta versão, sendo que quanto ' +
          'menor o número, mais experiente ele é.',
      },
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
        EXAMPLE: '**Exemplo**:',
        EXAMPLES: '**Exemplos**:',
        '@USER': '@Usuario',
        SHORTCUT: 'Atalho',
        HELP_ABOUT_QUOTES: 'Note que em caso de nomes compostos, deve ser posto entre aspas.',
        HELP_ABOUT_VALID_DATE: 'Note que a data deve ser colocada no formato dd/mm/aaaa.',
        HELP_ABOUT_BOOLEAN: ({ values, }) => 'Note que aceita somente **1** para ' +
          `**${values[1]}** e **0** para **${values[0]}**,`,
        HELP_ABOUT_ALLOW_FIELD: () => 'Note que este é um campo livre, porém procure ' +
          'escrever corretamente respeitando maiúsculas, acentos, sem abreviações e etc.',
        HELP_ABOUT_ACCEPT_VALUES_ONLY: ({ values, lastValue, }) => 'Aceita somente os valores: ' +
          values + ' ou ' + lastValue,
        HELP_ABOUT_INTEGER_ONLY: ({ range, }) => 'Aceita somente números inteiros ' +
          (range ? `entre **${range[0]}** e **${range[1]}**.` : '.'),
      },
    },
    help: {
      name: 'ajuda',
      resume: 'Busca ajuda do Bot e de seus comandos',
      messages: {
        COMMAND_NOT_FOUND: ({ command, helpCommand, }) => `O comando \`${command}\` não existe, ` +
          `entre \`${helpCommand}\` para ver todos os comandos`,
        METHOD_NOT_FOUND: ({ method, }) => `Método \`${method}\` não encontrado`,
        NO_INFO_AVAILABLE: '__***Nenhuma informação extra disponível***__',
        WELCOME: () => {
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
        VIEW_ALL_METHODS: ({ command, }) => {
          return (
            `Entre com o comando \`${command}\` seguido de seu ` +
              'método para executá-lo, simples assim!\n\n'
          )
        },
        VIEW_MORE_DETAILS_COMMAND: ({ command, }) => {
          return `Quer mais detalhes? Entre \`${command}\` seguido de um comando!`
        },
        VIEW_MORE_DETAILS_METHOD: ({ command, }) => {
          return `Quer mais detalhes? Entre \`${command}\` seguido de um método!`
        },
        SEE_FROM_THE_BEGINNING: ({ command, }) => {
          return `Quer aprender do inicio? Entre \`${command}\` apenas!`
        },
        HELP_ABOUT_COMMAND: 'O comando de ajuda é aquele criado com um carinho especial para ' +
          'poder te guiar pelo Bot',
        HELP_ABOUT_COMMAND_ALL: ({ command, }) => {
          return (
            `Entre com \`${command}\` para ter todos os comandos listados com uma ` +
              'explicação resumida'
          )
        },
        HELP_ABOUT_COMMAND_MORE_COMMAND: ({ command, }) => {
          return (
            `Quer saber maiores informações sobre um comando? entre com \`${command}\` ` +
              'seguido pelo comando desejado e veja toda a descrição e métodos dele!'
          )
        },
        HELP_ABOUT_COMMAND_MORE_METHOD: ({ command, }) => {
          return (
            `Quer saber maiores informações sobre um método? entre com \`${command}\` ` +
              'seguido pelo comando e método desejados e veja toda a descrição de uso dele!'
          )
        },
        HELP_ABOUT_COMMAND_CONCLUSION: ({ command, }) => {
          return (
            'Ou seja, se tem dúvida sobre o uso de algo, basta por ele depois de ' +
              `\`${command}\`!`
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
        list: {
          name: 'listar',
          resume: 'Lista os perfis disponíveis',
          params: {
            pag: 'pag',
            name: 'nome',
            nick: 'nick',
            age: 'idade',
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
        HELP_VIEW_ONLY: 'Visualiza o perfil do jogador mencionado',
        HELP_VIEW_MENTION: 'Visualiza o próprio perfil',
        HELP_VIEW_MENTIONS: 'Visualiza o perfil de todos os jogadores mencionados',
        HELP_PROFILE_ABOUT: 'O perfil é dividido em duas sessões básicas: **Pessoal** e **Jogo**.',
        HELP_PROFILE_ABOUT_PERSONAL: 'A sessão pessoal exibe informações básicas do jogador ' +
          'enquanto a sessão de jogo exibe informações do jogador em relação aos diferentes ' +
          'jogos da franquia.',
        HELP_PROFILE_ABOUT_PERSONAL_EDIT: ({ command, }) => 'Para editar as ' +
          `informações básicas, basta entrar com \`${command}\` seguido do identificador da ` +
          'informação. Veja:',
        HELP_PROFILE_ABOUT_NAME_PARAM: 'Edita o nome do jogador.',
        HELP_PROFILE_ABOUT_NICK_PARAM: 'Edita o nick do jogador',
        HELP_PROFILE_ABOUT_BIRTH_PARAM: 'Edita a data de nascimento do jogador, a qual é usada ' +
          'para calcular a idade.',
        HELP_PROFILE_ABOUT_GENRE_PARAM: 'Edita o gênero do jogador.',
        HELP_PROFILE_ABOUT_CITY_PARAM: 'Edita a cidade do jogador',
        HELP_PROFILE_ABOUT_STATE_PARAM: 'Edita o estado do jogador',
        HELP_PROFILE_ABOUT_COUNTRY_PARAM: 'Edita o país do jogador',
        HELP_PROFILE_ABOUT_EXPERIENCE_EDIT: 'Para editar as informações de jogo é a mesma coisa, ' +
          'porém acrescentamos um prefixo ao nome da informação para informar a versão do jogo ' +
          'que desejamos alterar. Os prefixos disponíveis são:',
        HELP_PROFILE_ABOUT_EXPERIENCE_TO_EXAMPLE: 'Para exemplificar a edição das informações de ' +
          'jogo, utilizaremos o prefixo da versão Together do jogo, mas basta trocar o prefixo ' +
          'para mudar de versão!',
        HELP_PROFILE_MULTIPLE_EDIT: 'Também vale dizer que você não precisa editar uma única ' +
          'informação por comando, mas pode sim editar várias de uma só vez:',
        NO_PROFILE: ({ profile, }) => profile + ' ainda não possui um perfil',
        PROFILE_CREATE: ({ command, }) => `Perfil criado! Use ${command} para aprender a editar ` +
          'o perfil',
        USE_PAGE_PARAM: ({ param, }) => `Use o parâmetro \`${param}\` para mudar de ` +
          'página, sendo **N** a página desejada.',
        LIST_HELP: ({ command, }) => `Entre ${command} para maiores detalhes.`,
        N: 'N',
        NO_PROFILE_FOUND: 'Nenhum perfil encontrado com os critérios solicitados',
        HELP_ABOUT_LIST_PAG: ({ amount, }) => `Este método exibe apenas ${amount} registros por ` +
          'vez, sendo assim será necessário adicionar um parâmetro de página para visualizar ' +
          'mais registros. Veja:',
        HELP_LIST_PAG: 'Exibe os registros da página solicitada.',
        HELP_LIST_PAG_HIDDEN: 'Caso este parâmetro seja omitido, será considerado valor **1** ' +
          'por padrão',
        HELP_ABOUT_LIST_SEARCH: 'Também é possível filtrar os perfis listados pelas suas ' +
          'propriedades, veja:',
        HELP_LIST_SEARCH_NAME: 'Busca perfis com o nome digitado',
        HELP_LIST_SEARCH_NICK: 'Busca perfis com o nick digitado',
        HELP_LIST_SEARCH_AGE: 'Busca perfis com a idade digitada',
        HELP_LIST_SEARCH_GENRE: 'Busca perfis do gênero digitado',
        HELP_LIST_SEARCH_CITY: 'Busca perfis da cidade digitada',
        HELP_LIST_SEARCH_STATE: 'Busca perfis do estado digitado',
        HELP_LIST_SEARCH_COUNTRY: 'Busca perfis do país digitado',
        HELP_ABOUT_LIST_MULTI_SEARCH: 'Você também pode buscar por vários filtros ao mesmo ' +
          'tempo, porém note que somente irá encontrar resultados que combinem com **todos** os ' +
          'filtros',
        HELP_LIST_MULTI_SEARCH: 'Efetua busca de perfis por mais de uma informação',
      },
    },
    stream: {
      name: 'stream',
      resume: 'Lista canais de Streamers focados em Don\'t Starve',
    },
  },
})