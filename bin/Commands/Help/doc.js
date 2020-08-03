module.exports = { // Documentação
  main: (_Message, { prefix, }) => {
    const command = Dictionary.getTranslateModule(_Message.serverConfig.lang, 'help')

    _Message.setFromDictionary('help', 'HELP_ABOUT_COMMAND', {}, { breakLine: 2, })

    _Message.setFromDictionary(
      'help', 'HELP_ABOUT_COMMAND_ALL', { command: prefix + command, }, { breakLine: 2, }
    )

    _Message.setFromDictionary(
      'help',
      'HELP_ABOUT_COMMAND_MORE_COMMAND',
      { command: prefix + command, },
      { breakLine: 2, }
    )

    _Message.setFromDictionary(
      'help',
      'HELP_ABOUT_COMMAND_MORE_METHOD',
      { command: prefix + command, },
      { breakLine: 2, }
    )

    _Message.setFromDictionary(
      'help', 'HELP_ABOUT_COMMAND_CONCLUSION', { command: prefix + command, }
    )
  },
}