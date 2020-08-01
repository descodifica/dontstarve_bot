// Adiciona sessão para portugês do brasil ao dicionário
global.Dictionary.add('en', {
  name: 'English',
  flag: '🇺🇸',
  dateFormat: { day: 2, month: 1, year: 1, sep: '-', },
  texts: {
    config: {
      name: 'config',
      resume: 'Configure Bot on the server (server owner only)',
      methods: {
        lang: {
          name: 'lang',
          resume: 'Change the Bot language',
          doc: _Message => {
            _Message.set('Accept values: \n\n')

            Object.values(Dictionary.langs()).map(lang => {
              _Message.set(`> ${lang.flag} \`${lang.initials.padEnd(4, ' ')} | ${lang.name}\` \n`)
            })
          },
        },
        prefix: {
          name: 'prefix',
          resume: 'Changes the prefix of the Bot',
          doc: (_Message, { prefix, }) => {
            _Message.set(
              'Prefix is the text entered before a command to let the Bot know it is for' +
                 'he. By default we use the prefix `: ds` and currently this server is' +
                 `configured to use the prefix \`${prefix}\`, but you can change it with this` +
                 'command.\n\n' +
                 '***Example:***\n\n' +
                 `\'${prefix}config prefix dont:\``
            )
          },
        },
      },
      messages: {
        INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => 'The language" $ {lang} "is ' +
          'invalid. Accepted values are: $ {firstLangs} and $ {lastLang}',
        UPDATED_LANGUAGE: 'Language updated successfully',
        UPDATE_LANGUAGE_ERROR: 'There was a problem changing the language',
        UPDATED_PREFIX: 'Ocorreu um problema ao mudar o idioma',
        UPDATE_PREFIX_ERROR: 'There was a problem changing the prefix',
      },
    },
    experience: {
      methods: {
        edit: {
          params: {
            version: 'version',
            have: 'have',
            platform: 'platform',
            hours: 'hours',
            main: 'main',
            survived: 'survived',
            level: 'rank',
          },
        },
      },
    },
    general: {
      messages: {
        COMMAND_NOT_FOUND: ({ command, }) => `Command "${command}" does not exist`,
        METHOD_NOT_EXISTS: ({ method, }) => `Method" ${method} "does not exist`,
        OWNER_CONTROL_ONLY: 'This command can only be used by the server owner!',
        COMMAND_METHOD_REQUIRED: 'It is necessary to pass a method to the command. Enter ' +
          'help command for more details',
        METHODS: 'methods',
        METHOD: 'method',
        COMMANDS: 'commands',
        COMMAND: 'command',
        YEARS: 'years',
        YES: 'Yes',
        NO: 'No',
        INVALID_OPTION: ({ prop, options, lastOption, }) => `Invalid value for property ${prop}. ` +
          `Accepted values are ${options} and ${lastOption}.`,
        INVALID_DATE: ({ prop, }) => `Invalid date for property ${prop}`,
        LONG_TEXT: ({ prop, }) => `Value too long for property ${prop}`,
        INVALID_INTEGER: ({ prop, }) => `Property ${prop} must be an integer value`,
        INVALID_RELATION: ({ prop, options, lastOption, }) => `Invalid value for property ${prop}. ` +
          `Accepted values are ${options} and ${lastOption}.`,
        WELCOME: ({ userName, serverName, }, { prefix, }) => {
          return (
            `🇺🇲 Hello ${userName}! I'm really glad you're using me on your server ${serverName}, ` +
              'i really hope you enjoy the experience :D. \n\n' +
              `So let\'s start? On your server, enter the command \`${prefix}help\` to get a ` +
              'list of all available commands and how to use them.\n\n' +
              `Do you want Bot in yours in english? Enter the command \`${prefix}config ling en\`! `
          )
        },
      },
    },
    help: {
      name: 'help',
      resume: 'Seek help from Bot and its commands',
      doc: (_Message, { prefix, }) => {
        _Message.set(
          'The help command is the one created with a special affection to be able to guide you ' +
            'through the Bot. \n\n' +
           `Enter \`${prefix}help\` to have all commands listed with an explanation` +
             'summarized \n\n' +
           `Want to know more information about a command? enter \`${prefix}help\` followed by ` +
             'by the desired command and see all its description and methods! \n\n' +
           `Want to know more information about a method? enter \`${prefix}help\` followed by ` +
             'by the desired command and method and see the full description of its use! \n\n' +
           `That is, if you are unsure about using something, just put it in after \`${prefix}help\`!`
        )
      },
      messages: {
        COMMAND_NOT_FOUND: ({ command, }) => `Command \`${command}\` does not exist`,
        METHOD_NOT_EXISTS: ({ method, }) => `Method \`${method}\` does not exist`,
        NO_INFO_AVAILABLE: '__***No extra information available***__',
        WELCOME: ({ word, }) => {
          return 'Welcome to ***Don\'t Starve*** Bot help for ***DISCORD***! \n\n' +
          'I hope it\'s useless, so let\'s get started! '
        },
        VIEW_ALL_COMMANDS: (p, { prefix, }) => {
          return (
            `Enter as the Bot prefix (by default it is \`${prefix}\`) followed by a command for` +
               'run it, it\'s that simple!\n\n' +
               'See below for a descriptive list of all possible commands:\n\n'
          )
        },
        VIEW_ALL_METHODS: ({ command, }, { prefix, }) => {
          return (
            `Enter the command \`${command}\` followed by your method to execute it, as simple as ` +
              'that!\n\n'
          )
        },
        VIEW_MORE_DETAILS: ({ command, word, }, { prefix, }) => {
          return (
            `Want more details? Enter \`${command}\` followed by a ${word}!\n\n` +
             `Do you want to learn from the beginning? Enter \`${prefix}help\`! `
          )
        },
      },
    },
    profile: {
      name: 'profile',
      resume: 'Player Profile',
      methods: {
        view: {
          name: 'see',
          resume: 'View a player\'s profile or your own',
          doc: (_Message, { prefix, }) => {
            _Message.set('***Examples:***\n\n')

            _Message.setExampleAndExplanation(
              prefix + 'profile see',
              'View your own profile',
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile see @User',
              'View the profile of the mentioned player',
              { breakBottom: 2, }
            )

            _Message.set(`***Shortcut:*** \`${prefix}profile\``)
          },
        },
        edit: {
          name: 'edit',
          resume: 'Edit profile information',
          doc: (_Message, { prefix, }) => {
            _Message.set(
              'The profile is divided into two basic sessions: ***Personal*** and ***Game***. \n\n' +
               'The personal session displays basic player information while the game session' +
                 'displays player information regarding the different games in the franchise.\n\n' +
               `To edit the basic information, simply enter \`${prefix}profile edit\`` +
                 'followed by the information identifier. See:\n\n'
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit name "Rafael Dias"',
              [
                'Edit the player\'s name.',
                'Note that in case of compound names, it must be enclosed in quotation marks.',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit birth 1986-07-03',
              [
                'Edit the player\'s birth date which is used to calculate age.',
                'Note that the date must be placed in the format yyyy-mm-dd.',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit genre 1',
              [
                'Edit the player\'s gender.',
                'Note that you only accept **1** for **Male** and **0** for **Female**',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit city Petrópolis',
              [
                'Edit the player\'s city',
                'Note that in case of compound names, it must be enclosed in quotation marks.',
                'Note also that this is a free field, but try to write correctly' +
                  'respecting capital letters, accents, without abbreviations, etc. if you want to ' +
                  'be found in city searches.',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit state "Rio de Janeiro"',
              [
                'Edit player status',
                'Note that in case of compound names, it must be enclosed in quotation marks.',
                'Note also that this is a free field, but try to write correctly' +
                  'respecting capital letters, accents, without abbreviations, etc. if you want to ' +
                  'be found in state searches.',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit country Brasil',
              [
                'Edit the player\'s country',
                'Note that in case of compound names, it must be enclosed in quotation marks.',
                'Note also that this is a free field, but try to write correctly' +
                   'respecting capital letters, accents, without abbreviations, etc. if you want ' +
                   'to be found in country searches.',
              ],
              { breakBottom: 2, }
            )

            _Message.set(
              'To edit game information is the same, but we add a prefix' +
               'to the name of the information to inform the version of the game that we want to ' +
               'change.The available prefixes are \n\n' +
               '`ds.` *Don \'t Starve*\n' +
               '`sw.` *Don\'t Starve Shipwrecked*\n' +
               '`ham.` * Don\'t Starve Hamet*\n' +
               '`dst.` *Don\'t Starve Together*\n\n' +
               'To exemplify the editing of game information, we will use the prefix of' +
                 'Together version of the game, but just change the prefix to change the version!' +
               'See:\n\n'
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit dst.have 1',
              [
                'Defines whether the player has this version of the game.',
                'Accepts **1** for **"Yes"** and **0** for **"No"**.',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit dst.platform Steam',
              [
                'Defines on which platform the player has this version of the game.',
                'Only accept values: Steam, PS, Xbox, Android or Iphone.',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit dst.hours 300',
              [
                'Sets the number of hours for the player in this version of the game.',
                'Only accepts whole numbers',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit dst.main Wickerbottom',
              [
                'Defines whether the player is "Main" for any character.',
                'Only accept the names of the characters.',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit dst.survived 99',
              [
                'Defines how many days at most the player managed to survive in this version of ' +
                  'the game.',
                'Only accepts whole numbers',
              ],
              { breakBottom: 2, }
            )

            _Message.setExampleAndExplanation(
              prefix + 'profile edit dst.rank 4',
              [
                'Defines the player\'s rank in this version, the lower the number, the more' +
                   'experienced he is.',
                'Only accepts whole numbers from 1 to 9',
              ],
              { breakBottom: 2, }
            )

            _Message.set(
              'It\'s also worth saying that you don\'t need to edit a single piece of information ' +
                'per command, but you can edit several at once: See:\n\n' +
                 `\`${prefix}profile edit name "Rafael Dias" birth 1986-07-03 dst.main ` +
                 'Wickerbottom`'
            )
          },
          params: {
            name: 'name',
            nick: 'nick',
            birth: 'birth',
            city: 'city',
            state: 'state',
            country: 'country',
            genre: 'genre',
          },
        },
      },
      messages: {
        CREATE: (p, { prefix, }) => `Your profile has just been created! Enter ${prefix}help ` +
        'profile edit to know how to edit it!',
        CREATE_ERROR: 'There was an error creating your profile',
        UPDATE: 'Updated profile',
        UPDATE_ERROR: 'There were problems updating one or more profile information',
        NO_PROFILE: ({ user, }) => `***${user}*** doesn't have a profile yet!`,
        PROFILE_NAME: 'Name',
        PROFILE_NICK: 'Nick',
        PROFILE_AGE: 'Age',
        PROFILE_GENRE: 'Genre',
        PROFILE_LOCATE: 'Location',
        PROFILE_HAVE: 'Have',
        PROFILE_PLATFORM: 'Platform',
        PROFILE_HOURS_PLAYED: 'Hours Played',
        PROFILE_SURVIVED: 'Survived by',
        PROFILE_LEVEL: 'Rank',
        PROFILE_PROFILE: ({ name, }) => name + 's profile',
        DAYS: 'days',
        ABDUCTED_TEXT: 'Abductee - Just started',
        HUNGRY_TEXT: 'Hungry - Survived for less than 1 year and / or still knows little ',
        EXPLORER_TEXT: 'Explorer - Has survived for at least 1 year ... but doesn\'t know much' +
          'about the game',
        SURVIVOR_TEXT: 'Survivor - Has survived for at least 1 year and has a knowledge game basics',
        BACKPACKER_TEXT: 'Backpacker - Has survived for at least 1 year and has a knowledge' +
        'reasonable of the game',
        CONSTANTIAN_TEXT: 'Constantiano - Has survived for at least 5 years and has a average ' +
        'knowledge of the game',
        CHARLIES_FRIEND_TEXT: 'Charlie\'s friend - Has survived for at least 7 years and has one' +
        'average knowledge of the game',
        KING_OF_CONSTANT_TEXT: 'Rei do Constant- Has survived for at least 7 years and has one' +
        'advanced knowledge of the game',
        ALLY_OF_THEM_TEXT: 'Ally of "Eles" - Has survived for at least 10 years and has atotal ' +
        'or almost total knowledge of the game',
      },
    },
    stream: {
      name: 'stream',
      resume: 'List of Streamers focused on Don \'t Starve',
    },
  },
})