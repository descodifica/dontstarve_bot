// Adiciona sessão para inglês ao dicionário
global.Dictionary.add('en', {
  config: {
    name: 'config',
    resume: 'Configure the bot on the server (server owner only)',
    methods: {
      lang: {
        name: 'lang',
        resume: 'Change the Bot language',
        doc: [
          'Accepts the values:\n',
          '> de - German',
          '> en - English',
          '> es - Spanish',
          '> fr = French',
          '> it - Italian',
          '> ptbr - Brazilian Portuguese',
          '> zhcn - Simplified Chinese',
        ],
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `the language" ${lang}" is invalid. ` +
        `Accepted values are: ${firstLangs} and ${lastLang}`,
      UPDATED_LANGUAGE: 'language updated successfully',
      UPDATE_LANGUAGE_ERROR: 'there was a problem changing the language',
    },
  },
  general: {
    messages: {
      COMMAND_NOT_FOUND: ({ command, }) => `command "${command}" does not exist`,
      METHOD_NOT_EXISTS: ({ method, }) => `method "${method}" does not exist`,
      OWNER_CONTROL_ONLY: 'this command can only be used by the server owner!',
      COMMAND_METHOD_REQUIRED: 'It is necessary to pass a method to the command. Enter the ' +
        'help command for more details',
      METHODS: 'methods',
      METHOD: 'method',
      COMMANDS: 'commands',
      COMMAND: 'command',
    },
  },
  help: {
    name: 'help',
    resume: 'Seek help from the bot and its commands',
    messages: {
      COMMAND_NOT_FOUND: ({ command, prefix, }) => `the command" ${command} "does not exist, ` +
        `between "${prefix}help" to see all commands`,
      METHOD_NOT_FOUND: ({ method, }) => `Method "${method}" not found`,
      VIEW_MORE_INFO: ({ prefix, command, method, }) => `See more information about ${prefix}` +
        `${command} ${method}:`,
      NO_INFO_AVAILABLE: 'No extra information available',
      VIEW_ALL: ({ word, }) => `see here a list of all available ${word}`,
      VIEW_MORE_DETAILS: ({ command, word, }) => `Enter" "${command}" followed by a ${word} for ` +
        'more details',
    },
  },
})