// Adiciona sessão para espanhol ao dicionário
global.Dictionary.add('es', {
  config: {
    name: 'config',
    resume: 'Configura el bot en el servidor (solo el propietario del servidor)',
    methods: {
      lang: {
        name: 'idioma',
        resume: 'Cambiar el idioma del bot',
        doc: [
          'Acepta los valores:\n',
          '> de - Alemán',
          '> en - Inglés',
          '> es - Español',
          '> fr = Francés',
          '> it - Italiano',
          '> ptbr - Portugués de Brasil',
          '> zhcn - Chino simplificado',
        ],
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `el idioma "${lang}" no es válido. ` +
        `Los valores aceptados son: ${firstLangs} y ${lastLang}`,
      UPDATED_LANGUAGE: 'idioma actualizado con éxito',
      UPDATE_LANGUAGE_ERROR: 'hubo un problema al cambiar el idioma',
    },
  },
  general: {
    messages: {
      COMMAND_NOT_FOUND: ({ command, }) => `comando "${command}" no existe`,
      METHOD_NOT_EXISTS: ({ method, }) => `el método "${method}" no existe`,
      OWNER_CONTROL_ONLY: '¡este comando solo puede ser utilizado por el propietario del servidor!',
      COMMAND_METHOD_REQUIRED: 'Es necesario pasar un método al comando. Ingrese el comando de ' +
        'ayuda para más detalles',
      METHODS: 'métodos',
      METHOD: 'método',
      COMMANDS: 'comandos',
      COMMAND: 'comando',
    },
  },
  help: {
    name: 'ayuda',
    resume: 'Busque ayuda del bot y sus comandos',
    messages: {
      COMMAND_NOT_FOUND: ({ command, prefix, }) => `el comando "${command}" no existe, ingrese ` +
        `"${prefix}ayuda" para ver todos los comandos`,
      METHOD_NOT_FOUND: ({ method, }) => `Método "${method}" no encontrado`,
      VIEW_MORE_INFO: ({ prefix, command, method, }) => `Ver más información sobre ${prefix}` +
        `${command} ${method}:`,
      NO_INFO_AVAILABLE: 'No hay información adicional disponible',
      VIEW_ALL: ({ word, }) => `mira aquí una lista de todos los ${word} disponibles`,
      VIEW_MORE_DETAILS: ({ command, word, }) => `Ingrese "${command}" seguido de un ${word} ` +
        'para más detalles',
    },
  },
})