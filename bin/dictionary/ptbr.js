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
})