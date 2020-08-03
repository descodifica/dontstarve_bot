module.exports = {
  lang: _Message => {
    _Message.setFromDictionary('config', 'HELP_ACCEPT_VALUES', {}, { breakLine: 2, })

    Object.values(Dictionary.langs()).map(lang => {
      _Message.set(`> ${lang.flag} \`${lang.initials.padEnd(4, ' ')} | ${lang.name}\` \n`)
    })
  },
  prefix: (_Message, { prefix, }) => {
    const translateCommand = (
      Dictionary.getTranslateModule(_Message.serverConfig.lang, 'config')
    )
    const translatedMethod = (
      Dictionary.getTranslateMethod(_Message.serverConfig.lang, 'config', 'lang')
    )

    _Message.setFromDictionary('config', 'HELP_ABOUT_PREFIX', {}, { breakLine: 2, })
    _Message.setFromDictionary('general', 'EXAMPLE', {}, { breakLine: 2, })
    _Message.set(`\`${prefix}${translateCommand} ${translatedMethod} dont:\``)
  },
}