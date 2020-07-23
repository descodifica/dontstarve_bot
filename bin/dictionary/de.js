// Adiciona sessão para alemão ao dicionário
global.Dictionary.add('de', {
  config: {
    name: 'einrichten',
    resume: 'Konfiguriert den Roboter auf dem Server (nur Serverbesitzer)',
    methods: {
      lang: {
        name: 'zunge',
        resume: 'Ändern Sie die Robotersprache',
        doc: [
          'Akzeptiert die Werte:\n',
          '> de - Deutsche',
          '> en - Englisch',
          '> es - Spanisch',
          '> fr = Französisch',
          '> it - Italienisch',
          '> ptbr - Brasilianisches Portugiesisch',
          '> zhcn - Vereinfachtes Chinesisch',
        ],
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `die Sprache "${lang}" ist ` +
        `ungültig. Akzeptierte Werte sind: ${firstLangs} und $ {lastLang}`,
      UPDATED_LANGUAGE: 'sprache erfolgreich aktualisiert',
      UPDATE_LANGUAGE_ERROR: 'es gab ein Problem beim Ändern der Sprache',
    },
  },
  general: {
    messages: {
      COMMAND_NOT_FOUND: ({ command, }) => `befehl "${command}" existiert nicht`,
      METHOD_NOT_EXISTS: ({ method, }) => `methode "${method}" existiert nicht`,
      OWNER_CONTROL_ONLY: 'dieser Befehl kann nur vom Serverbesitzer verwendet werden!',
      COMMAND_METHOD_REQUIRED: 'es ist notwendig, eine Methode an den Befehl zu übergeben. ' +
        'Geben Sie ein Hilfebefehl für weitere Details',
      METHODS: 'methoden',
      METHOD: 'methode',
      COMMANDS: 'befehle',
      COMMAND: 'befehl',
    },
  },
  help: {
    name: 'hilfe',
    resume: 'Bitten Sie den Bot und seine Befehle um Hilfe',
    messages: {
      COMMAND_NOT_FOUND: ({ command, prefix, }) => `der Befehl "${command}" existiert nicht. ` +
        `Geben Sie "${prefix}hilfe" ein, um alle Befehle anzuzeigen`,
      METHOD_NOT_FOUND: ({ method, }) => `methode "${method}" nicht gefunden`,
      VIEW_MORE_INFO: ({ prefix, command, method, }) => `weitere Informationen zu ${prefix}` +
      `${command} ${method}:`,
      NO_INFO_AVAILABLE: 'keine zusätzlichen Informationen verfügbar',
      VIEW_ALL: ({ word, }) => `hier finden Sie eine Liste aller verfügbaren ${word}`,
      VIEW_MORE_DETAILS: ({ command, word, }) => `Geben Sie "${command}" gefolgt von einem ` +
        `${word} für ein mehr Details haben`,
    },
  },
})