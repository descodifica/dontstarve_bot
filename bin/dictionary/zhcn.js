// Adiciona formato de data para brasil ao dicionário
global.Dictionary.dateFormat('zhcn', { day: 2, month: 1, year: 1, sep: '-', })

// Adiciona sessão para portugês do brasil ao dicionário
global.Dictionary.add('zhcn', {
  config: {
    name: '建立',
    resume: '在服务器上配置机械手（仅服务器所有者）',
    methods: {
      lang: {
        name: '语言',
        resume: '更改Bot语言',
        doc: _Message => {
          _Message.set(
            '接受以下值：:\n\n' +
            '> 🇩🇪 `de` - Deutsche\n' +
            '> 🇺🇸 `en` - English\n' +
            '> 🇪🇸 `es` - Español\n' +
            '> 🇫🇷 `fr` - Français\n' +
            '> 🇮🇹 `it` - Italiano\n' +
            '> 🇧🇷 `ptbr` - Portugês do Brasil\n' +
            '> 🇨🇳 `zhcn` - 简体中文'
          )
        },
      },
      prefix: {
        name: '字首',
        resume: '更改Bot的前缀',
        doc: (_Message, { prefix, }) => {
          _Message.set(
            `前缀是在命令之前输入的文本，以便Bot知道它适合他。 默认情况下，我们使用前缀 \`${prefix}\`，` +
              `当前此服务器已配置为使用前缀 \`${prefix}\`，但是您可以使用以下命令更改它\n\n` +
              '***例:***\n\n' +
              `\`${prefix}立 字首 dont:\``
          )
        },
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `语言 ${lang}无效。 接受的值是：` +
        `${firstLangs}和${lastLang}`,
      UPDATED_LANGUAGE: '语言更新成功',
      UPDATE_LANGUAGE_ERROR: '更改语言时出现问题',
      UPDATED_PREFIX: '前缀更新成功',
      UPDATE_PREFIX_ERROR: '更改前缀时出现问题',
    },
  },
  experience: {
    methods: {
      edit: {
        params: {
          version: '版',
          have: '它有',
          platform: '平台',
          hours: '小时',
          main: '主要',
          survived: '幸存下来',
          level: '秩',
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
          `🇧🇷 Olá **${userName}**! Fico realmente feliz que esteja me utilizando no seu servidor ` +
          `**${serverName}**, espero de verdade que você curta a experiência :D.\n\n` +
         `Então vamos começar? No seu servidor entre com o comando \`${prefix}ajuda\` para obter ` +
         'uma lista de todos os comandos dispníveis e como usá-los.\n\n'
        )
      },
    },
  },
  help: {
    name: 'ajuda',
    resume: 'Busca ajuda do Bot e de seus comandos',
    doc: (_Message, { prefix, }) => {
      _Message.set(
        'O comando de ajuda é aquele criado com um carinho especial para poder te guiar pelo Bot.' +
        '\n\n' +
        `Entre com \`${prefix}ajuda\` para ter todos os comandos listados com uma explicação ` +
          'resumida\n\n' +
          `Quer saber maiores informações sobre um comando? entre com \`${prefix}ajuda\` seguido ` +
            'pelo comando desejado e veja toda a descrição e métodos dele!\n\n' +
          `Quer saber maiores informações sobre um método? entre com \`${prefix}ajuda\` seguido ` +
            'pelo comando e método desejados e veja toda a descrição de uso dele!\n\n' +
          `Ou seja, se tem dúvida sobre o uso de algo, basta por ele depois de \`${prefix}ajuda\`!`
      )
    },
    messages: {
      COMMAND_NOT_FOUND: ({ command, }, { prefix, }) => `O comando "${command}" não existe, ` +
        `entre "${prefix}Ajuda" para ver todos os comandos`,
      METHOD_NOT_FOUND: ({ method, }) => `Método "${method}" não encontrado`,
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
        resume: 'Vizualiza o perfil de um jogador ou o seu próprio',
        doc: (_Message, { prefix, }) => {
          _Message.set('***Exemplos:***\n\n')

          _Message.setExampleAndExplanation(
            prefix + 'perfil ver',
            'Visualiza o próprio perfil',
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil ver @Usuario',
            'Visualiza o perfil do jogador mencionado',
            { breakBottom: 2, }
          )

          _Message.set(`***Atalho:*** \`${prefix}perfil\``)
        },
      },
      edit: {
        name: 'editar',
        resume: 'Edita informações do perfil',
        doc: (_Message, { prefix, }) => {
          _Message.set(
            'O perfil é dividido em duas sessões básicas: ***Pessoal*** e ***Jogo***.\n\n' +
            'A sessão pessoal exibe informações básicas do jogador enquanto a sessão de jogo ' +
              'exibe informações do jogador em relação aos diferentes jogos da franquia.\n\n' +
            `Para editar as informações básicas, basta entrar com \`${prefix}perfil editar\` ` +
              'seguido do identificador da informação. Veja:\n\n'
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar nome "Rafael Dias"',
            [
              'Edita o nome do jogador.',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar nascimento 03/07/1986',
            [
              'Edita a data de nascimento do jogador a qual é usada para calcular a idade.',
              'Note que a data deve ser colocada no formato dd/mm/aaaa.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar genero 1',
            [
              'Edita o gênero do jogador.',
              'Note que aceita somente **1** para **Masculino** e **0** para **Feminino**',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar cidade Petrópolis',
            [
              'Edita a cidade do jogador',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
              'Note também que este é um campo livre, porém procure escrever corretamente' +
                'respeitando maiúsculas, acentos, sem abreviações e etc caso queira ser ' +
                'encontrado nas buscas pela cidade.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar estado "Rio de Janeiro"',
            [
              'Edita o estado do jogador',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
              'Note também que este é um campo livre, porém procure escrever corretamente' +
                'respeitando maiúsculas, acentos, sem abreviações e etc caso queira ser ' +
                'encontrado nas buscas pelo estado.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar pais Brasil',
            [
              'Edita o país do jogador',
              'Note que em caso de nomes compostos, deve ser posto entre aspas.',
              'Note também que este é um campo livre, porém procure escrever corretamente' +
                'respeitando maiúsculas, acentos, sem abreviações e etc caso queira ser ' +
                'encontrado nas buscas pelo país.',
            ],
            { breakBottom: 2, }
          )

          _Message.set(
            'Para editar as informações de jogo é a mesma coisa, porém acrescentamos um prefixo  ' +
            'ao nome da informação para informar a versão do jogo que desejamos alterar.' +
            'Os prefixos disponíveis são\n\n' +
            '`ds.` *Don\'t Starve*\n' +
            '`sw.` *Don\'t Starve Shipwrecked*\n' +
            '`ham.` *Don\'t Starve Hamet*\n' +
            '`dst.` *Don\'t Starve Together*\n\n' +
            'Para exemplificar a edição das informações de jogo, utilizaremos o prefixo da ' +
              'versão Together do jogo, mas basta trocar o prefixo para mudar de versão!' +
            'Veja:\n\n'
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.possui 1',
            [
              'Define se o jogador possui esta versão do jogo.',
              'Aceita **1** para **"Sim"** e **0** para **"Não"**.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.plataforma Steam',
            [
              'Define em qual plataforma o jogador possui esta versão do jogo.',
              'Aceita somente os valores: Steam, PS, Xbox, Android ou Iphone.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.horas 300',
            [
              'Define o número de horas do jogador nesta versão do jogo.',
              'Aceita somente números inteiros',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.main Wickerbottom',
            [
              'Define se o jogador é "Main" de algum personagem.',
              'Aceita somente os nomes dos personagens.',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.sobreviveu 99',
            [
              'Define quantos dias no maximo o jogador conseguiu sobreviver nesta versão do jogo',
              'Aceita somente números inteiros',
            ],
            { breakBottom: 2, }
          )

          _Message.setExampleAndExplanation(
            prefix + 'perfil editar dst.rank 4',
            [
              'Define o rank do jogador nesta versão, sendo que quanto menor o número, mais ' +
                'experiente ele é.',
              'Aceita somente números inteiros de 1 a 9',
            ],
            { breakBottom: 2, }
          )

          _Message.set(
            'Também vale dizer que você não precisa editar uma única informação por comando, mas ' +
              'pode sim editar várias de uma só vez: Veja:\n\n' +
              `\`${prefix}perfil editar nome "Rafael Dias" nascimento 03/07/1986 dst.main ` +
              'Wickerbottom\`'
          )
        },
        params: {
          name: 'nome',
          birth: 'nascimento',
          city: 'cidade',
          state: 'estado',
          country: 'pais',
          genre: 'genero',
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
      PROFILE_GENRE: 'Gênero',
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
  stream: {
    name: 'stream',
    resume: 'Lista canais de Streamers focados em Don\'t Starve',
  },
})