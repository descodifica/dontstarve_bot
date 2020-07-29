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
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `O idioma "${lang}" é inválido. ` +
        `Valores aceitos são: ${firstLangs} e ${lastLang}`,
      UPDATED_LANGUAGE: 'Idioma atualizado com sucesso',
      UPDATE_LANGUAGE_ERROR: 'O um problema ao mudar o idioma',
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
      COMMAND_NOT_FOUND: ({ command, }) => `Comando "${command}" não existe`,
      METHOD_NOT_EXISTS: ({ method, }) => `Método "${method}" não existe`,
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
    },
  },
  help: {
    name: 'ajuda',
    resume: 'Busca ajuda do bot e de seus comandos',
    messages: {
      COMMAND_NOT_FOUND: ({ command, }, { prefix, }) => `O comando "${command}" não existe, ` +
        `entre "${prefix}Ajuda" para ver todos os comandos`,
      METHOD_NOT_FOUND: ({ method, }) => `Método "${method}" não encontrado`,
      VIEW_MORE_INFO: ({ command, method, }, { prefix, }) => 'Veja maiores informações de ' +
       `${prefix}${command} ${method}:`,
      NO_INFO_AVAILABLE: 'Nenhuma informação extra disponível',
      VIEW_ALL: ({ word, }) => `Veja aqui uma lista de todos os ${word} disponíveis`,
      VIEW_MORE_DETAILS: ({ command, word, }) => `Entre "${command}" seguido de um ${word} para ` +
        'ter maiores detalhes',
    },
  },
  profile: {
    name: 'perfil',
    resume: 'Perfil dos jogadores',
    methods: {
      view: {
        name: 'ver',
        resume: 'Vizualiza o perfil de um jogador ou o seu próprio',
        doc: [
          'Exemplos:',
          '',
          '> ds:perfil ver - Visualiza o próprio perfil ',
          '> ds:perfil ver @Usuario - Visualiza perfil do jogador',
          '',
          'Atalho: ds:perfil',
        ],
      },
      edit: {
        name: 'editar',
        resume: 'Edita informações do perfil',
        doc: [
          [
            'O perfil é dividido em duas sessões básicas: Pessoal e Jogo.',
            '',
            'A sessão pessoal exibe informações básicas do jogador enquanto a sessão de jogo ' +
              'exibe informações do jogador em relação aos diferentes jogos da franquia.',
            '',
            'Para editar as informações, basta entrar com `ds:perfil editar` seguido do ' +
              'identificador da informação. Veja:',
            '',
            '`ds:perfil editar nome "Rafael Dias"`',
            '',
            '> Edita o nome do jogador.',
            '> Note que em caso de nomes compostos, deve ser posto entre aspas.',
            '',
            '`ds:perfil editar nascimento 03/07/1986`',
            '',
            '> Edita a data de nascimento do jogaodor a qual é usada para calcular a idade.',
            '> Note que a data deve ser colocada no formato dd/mm/aaaa.',
            '',
            '`ds:perfil editar Petrópolis`',
            '',
            '> Edita a cidade do jogador',
            '> Note que em caso de nomes compostos, deve ser posto entre aspas.',
            '',
            '`ds:perfil editar estado`',
            '',
            '> Edita o estado do jogador',
            '> Note que em caso de nomes compostos, deve ser posto entre aspas.',
            '',
            '`ds:perfil editar pais`',
            '',
            '> Edita o pais do jogador',
            '> Note que em caso de nomes compostos, deve ser posto entre aspas.',
          ],
          [
            'Para editar as informações de jogo é a mesma coisa, porém acrescentamos um prefixo  ' +
            'ao nome da informação para informar a versão do jogo que desejamos alterar.',
            '',
            'Os prefixos disponíveis são:',
            '',
            '> ds. - Don\'t Starve Solo',
            '> sw. - Don\'t Starve Shipwrecked',
            '> ham. - Don\'t Starve Hamet',
            '> dst. - Don\'t Starve Together',
          ],
          [
            'Para exemplificar a edição das informações de jogo, utilizaremos o prefixo da ' +
              'versão Together do jogo, mas basta trocar o prefixo para mudar de versão! Veja:',
            '',
            '`ds:perfil editar dst.possui 1`',
            '',
            '> Define se o jogador possui esta versão do jogo.',
            '> Aceita 1 para "Sim" e 0 para "Não".',
            '',
            '`ds:perfil editar dst.plataforma Steam`',
            '',
            '> Define em qual plataforma o jogador possui esta versão do jogo.',
            '> Aceita somente os valores: Steam, PS, Xbox, Android ou Iphone.',
            '',
            '`ds:perfil editar dst.horas 300`',
            '',
            '> Define o número de horas do jogador nesta versão do jogo.',
            '> Aceita somente números inteiros',
            '',
            '`ds:perfil editar dst.main Wickerbottom`',
            '',
            '> Define se o jogador é "Main" de algum personagem.',
            '> Aceita somente os nomes dos personagens.',
            '',
            '`ds:perfil editar dst.sobreviveu 99`',
            '',
            '> Define quantos dias no maximo o jogador conseguiu sobreviver nesta versão do jogo',
            '> Aceita somente números inteiros',
            '',
            '`ds:perfil editar dst.rank 4`',
            '',
            '> Define o rank do jogador nesta versão, sendo que quanto menor o número, mais ' +
              'experiente ele é.',
            '> Aceita somente números inteiros de 1 a 9',
          ],
          [
            'Também vale dizer que você não precisa editar uma única informação por comando, mas ' +
              'pode sim editar várias de uma só vez: Veja:',
            '',
            '`ds:perfil editar nome "Rafael Dias" nascimento 03/07/1986 dst.main Wickerbottom`',
          ],
        ],
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
      CREATE: (p, { prefix, }) => `Seu perfil acabou de ser criado! Entre ${prefix}ajuda perfil  ` +
      'editar para saber editar ele!',
      CREATE_ERROR: 'Ocorreu um erro ao criar o seu perfil',
      UPDATE: 'Perfil atualizado',
      UPDATE_ERROR: 'Ocorreram problemas ao atualizar uma ou mais informações do perfil',
      NO_PROFILE: ({ user, }) => `***${user}*** não possui um perfil ainda!`,
      PROFILE_NAME: 'Nome',
      PROFILE_NICK: 'Nick',
      PROFILE_AGE: 'Idade',
      PROFILE_LOCATE: 'Localização',
      PROFILE_HAVE: 'Possui',
      PROFILE_PLATFORM: 'Plataforma',
      PROFILE_HOURS_PLAYED: 'Horas Jogadas',
      PROFILE_SURVIVED: 'Sobreviveu por',
      PROFILE_LEVEL: 'Rank',
      PROFILE_PROFILE: ({ name, }) => 'Perfil de ' + name,
      DAYS: 'dias',
      ABDUCTED_TEXT: 'Abduzido - Acabou de começar',
      HUNGRY_TEXT: 'Faminto - Sobreviveu por menos de 1 ano e/ou ainda sabe pouco',
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
      ALLY_OF_THEM_TEXT: 'Aliado de "Eles" - Já sobreviveu por pelo menos 10 anos e tem um ' +
        'conhecimento total ou quase total do jogo',

    },
  },
})