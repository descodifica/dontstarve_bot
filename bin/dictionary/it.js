// Adiciona sessão para italiano ao dicionário
global.Dictionary.add('it', {
  config: {
    name: 'impostare',
    resume: 'Configura il robot server (solo proprietario del server)',
    methods: {
      lang: {
        name: 'ling',
        resume: 'Cambia la lingua del Bot',
        doc: [
          'Accetta valori: \n',
          '> from - German',
          '> en - English',
          '> es - Spanish',
          '> fr - francese',
          '> it - Italian',
          '> ptbr - Portoghese Brasiliano',
          '> zhcn - Cinese Semplificato',
        ],
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `la lingua "${lang}" non è valida. ` +
        `I valori accettati sono: ${firstLangs} e ${lastLang}`,
      UPDATED_LANGUAGE: 'lingua aggiornata correttamente',
      UPDATE_LANGUAGE_ERROR: 'si è verificato un problema durante la modifica della lingua',
    },
  },
  general: {
    messages: {
      COMMAND_NOT_FOUND: ({ command, }) => `il comando "${command}" non esiste`,
      METHOD_NOT_EXISTS: ({ method, }) => `il metodo "${method}" non esiste`,
      OWNER_CONTROL_ONLY: 'questo comando può essere utilizzato solo dal proprietario del server!',
      COMMAND_METHOD_REQUIRED: 'È necessario passare un metodo al comando. Inserisci comando' +
      ' di aiuto per maggiori dettagli',
      METHODS: 'metodi',
      METHOD: 'metodo',
      COMMANDS: 'comandi',
      COMMAND: 'comando',
    },
  },
  help: {
    name: 'aiuto',
    resume: 'Chiedi aiuto al bot e ai suoi comandi',
    messages: {
      COMMAND_NOT_FOUND: ({ command, prefix, }) => `il comando "${command}"non esiste, tra` +
        `"${prefix}aiuto" per vedere tutti i comandi`,
      METHOD_NOT_FOUND: ({ method, }) => `Metodo "${method}" non trovato`,
      VIEW_MORE_INFO: ({ prefix, command, method, }) => `Vedi maggiori informazioni su ${prefix}` +
      `${command} ${method}:`,
      NO_INFO_AVAILABLE: 'Nessuna informazione aggiuntiva disponibile',
      VIEW_ALL: ({ word, }) => `vedi qui un elenco di tutti i ${word} disponibili`,
      VIEW_MORE_DETAILS: ({ command, word, }) => `Immettere "${command}" seguito da ${word} per` +
        'avere maggiori dettagli',
    },
  },
})