module.exports = {
  view: (_Message, { prefix, }) => {
    const commandTranslated = Dictionary.getTranslateModule(
      _Message.serverConfig.lang, 'profile'
    )

    const methodTranslated = Dictionary.getTranslateMethod(
      _Message.serverConfig.lang, 'profile', 'view'
    )

    const user = Dictionary.getMessage(_Message.serverConfig, 'general', '@USER')

    const shortcut = Dictionary.getMessage(_Message.serverConfig, 'general', 'SHORTCUT')

    _Message.setFromDictionary('general', 'EXAMPLES', {}, { breakLine: 2, })

    _Message.setExampleAndExplanation(
      prefix + commandTranslated + ' ' + methodTranslated,
      Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_VIEW_ONLY'),
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefix + commandTranslated + ' ' + methodTranslated + ' ' + user + '1'
      ),
      Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_VIEW_MENTION'),
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefix + commandTranslated + ' ' + methodTranslated + ' ' +
        user + '1' + ' ' + user + '2' + ' ' + user + '3'
      ),
      Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_VIEW_MENTIONS'),
      { breakBottom: 2, }
    )

    _Message.set(`**${shortcut}:** \`${prefix}${commandTranslated}\``)
  },
  edit: (_Message, { prefix, }) => {
    const yesTranslated = Dictionary.getMessage(
      _Message.serverConfig, 'general', 'YES'
    )

    const noTranslated = Dictionary.getMessage(
      _Message.serverConfig, 'general', 'NO'
    )

    const commandTranslated = Dictionary.getTranslateModule(
      _Message.serverConfig.lang, 'profile'
    )

    const methodTranslated = Dictionary.getTranslateMethod(
      _Message.serverConfig.lang, 'profile', 'edit'
    )

    const commandMethod = prefix + commandTranslated + ' ' + methodTranslated

    const paramNameTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'profile', 'edit', 'name'
      )
    )

    const paramNickTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'profile', 'edit', 'nick'
      )
    )

    const paramBirthTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'profile', 'edit', 'birth'
      )
    )

    const paramGenreTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'profile', 'edit', 'genre'
      )
    )

    const paramCityTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'profile', 'edit', 'city'
      )
    )

    const paramStateTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'profile', 'edit', 'state'
      )
    )

    const paramCountryTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'profile', 'edit', 'country'
      )
    )

    const paramHaveTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'experience', 'edit', 'have'
      )
    )

    const paramPlatformTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'experience', 'edit', 'platform'
      )
    )

    const paramHoursTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'experience', 'edit', 'hours'
      )
    )

    const paramMainTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'experience', 'edit', 'main'
      )
    )

    const paramSurvivedTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'experience', 'edit', 'survived'
      )
    )

    const paramRankTranslated = (
      Dictionary.getTranslateMethodParam(
        _Message.serverConfig.lang, 'experience', 'edit', 'rank'
      )
    )

    _Message.setFromDictionary('profile', 'HELP_PROFILE_ABOUT', {}, { breakLine: 2, })

    _Message.setFromDictionary(
      'profile', 'HELP_PROFILE_ABOUT_PERSONAL', {}, { breakLine: 2, }
    )

    _Message.setFromDictionary(
      'profile',
      'HELP_PROFILE_ABOUT_PERSONAL_EDIT',
      { command: commandMethod, },
      { breakLine: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' ' + paramNameTranslated + ' "Rafael Dias"',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_NAME_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' ' + paramNickTranslated + ' Hiker',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_NICK_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' ' + paramBirthTranslated + ' 03/07/1986',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_BIRTH_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_VALID_DATE'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' ' + paramGenreTranslated + ' 1',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_GENRE_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_BOOLEAN', {
            values: [ 'Feminino', 'Masculino', ],
          }
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' ' + paramCityTranslated + ' Petrópolis',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_CITY_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_ALLOW_FIELD'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' ' + paramStateTranslated + ' "Rio de Janeiro"',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_STATE_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_ALLOW_FIELD'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' ' + paramCountryTranslated + ' Brasil',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'profile', 'HELP_PROFILE_ABOUT_COUNTRY_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_ALLOW_FIELD'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setFromDictionary(
      'profile',
      'HELP_PROFILE_ABOUT_EXPERIENCE_EDIT',
      {},
      { breakLine: 2, }
    )

    _Message.set(
      '`ds.`   *Don\'t Starve*\n' +
      '`sw.`   *Don\'t Starve Shipwrecked*\n' +
      '`ham.` *Don\'t Starve Hamet*\n' +
      '`dst.` *Don\'t Starve Together*\n\n'
    )

    _Message.setFromDictionary(
      'profile',
      'HELP_PROFILE_ABOUT_EXPERIENCE_TO_EXAMPLE',
      {},
      { breakLine: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' dst.' + paramHaveTranslated + ' 1',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_HAVE_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_BOOLEAN', {
            values: [ noTranslated, yesTranslated, ],
          }
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' dst.' + paramPlatformTranslated + ' Steam',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_PLATFORM_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_ACCEPT_VALUES_ONLY',
          {
            values: 'Steam, PS, Xbox, Android',
            lastValue: 'Iphone',
          }
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' dst.' + paramHoursTranslated + ' 300',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_HOURS_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_INTEGER_ONLY'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' dst.' + paramMainTranslated + ' Wickerbottom',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_MAIN_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'experience', 'HELP_ABOUT_CHARACTER_ONLY'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' dst.' + paramSurvivedTranslated + ' 99',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_SURVIVED_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_INTEGER_ONLY'
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      commandMethod + ' dst.' + paramRankTranslated + ' 4',
      [
        Dictionary.getMessage(
          _Message.serverConfig, 'experience', 'HELP_PROFILE_ABOUT_RANK_PARAM'
        ),
        Dictionary.getMessage(
          _Message.serverConfig, 'general', 'HELP_ABOUT_INTEGER_ONLY', {
            range: [ 0, 9, ],
          }
        ),
      ],
      { breakBottom: 2, }
    )

    _Message.setFromDictionary(
      'profile',
      'HELP_PROFILE_MULTIPLE_EDIT',
      {},
      { breakLine: 2, }
    )

    _Message.set(
      `\`${prefix}${commandTranslated} ${methodTranslated} ` +
        `${paramNameTranslated} "Rafael Dias" ` +
        `${paramBirthTranslated} 03/07/1986 ` +
        `dst.${paramMainTranslated} Wickerbottom\``
    )
  },
  list: (_Message, { prefix, }) => {
    _Message.setFromDictionary('profile', 'HELP_ABOUT_LIST_PAG', { amount: 10, }, { breakLine: 2, })

    const prefixCommandMethod = (
      prefix +
      Dictionary.getTranslateModule(_Message.serverConfig.lang, 'profile') +
      ' ' +
      Dictionary.getTranslateMethod(_Message.serverConfig.lang, 'profile', 'list')
    )

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(_Message.serverConfig.lang, 'profile', 'list', 'pag') +
        ' 2'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_PAG'),
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_PAG_HIDDEN'),
      ],
      { breakBottom: 2, }
    )

    _Message.setFromDictionary('profile', 'HELP_ABOUT_LIST_SEARCH', {}, { breakLine: 2, })

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(_Message.serverConfig.lang, 'profile', 'list', 'name') +
        ' "Rafael Dias"'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_SEARCH_NAME'),
        Dictionary.getMessage(_Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(_Message.serverConfig.lang, 'profile', 'list', 'nick') +
        ' Hiker'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_SEARCH_NICK'),
        Dictionary.getMessage(_Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(_Message.serverConfig.lang, 'profile', 'list', 'age') +
        ' 34'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_SEARCH_AGE'),
        Dictionary.getMessage(_Message.serverConfig, 'general', 'HELP_ABOUT_INTEGER_ONLY'),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(_Message.serverConfig.lang, 'profile', 'list', 'genre') +
        ' 1'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_SEARCH_GENRE'),
        Dictionary.getMessage(_Message.serverConfig, 'general', 'HELP_ABOUT_BOOLEAN', {
          values: [ 'Feminino', 'Masculino', ],
        }),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(_Message.serverConfig.lang, 'profile', 'list', 'city') +
        ' Petrópolis'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_SEARCH_CITY'),
        Dictionary.getMessage(_Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(_Message.serverConfig.lang, 'profile', 'list', 'state') +
        ' "Rio de Janeiro"'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_SEARCH_STATE'),
        Dictionary.getMessage(_Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'),
      ],
      { breakBottom: 2, }
    )

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(
          _Message.serverConfig.lang, 'profile', 'list', 'country'
        ) +
        ' Brasil'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_SEARCH_COUNTRY'),
        Dictionary.getMessage(_Message.serverConfig, 'general', 'HELP_ABOUT_QUOTES'),
      ],
      { breakBottom: 2, }
    )

    _Message.setFromDictionary('profile', 'HELP_ABOUT_LIST_MULTI_SEARCH', {}, { breakLine: 2, })

    _Message.setExampleAndExplanation(
      (
        prefixCommandMethod +
        ' ' +
        Dictionary.getTranslateMethodParam(
          _Message.serverConfig.lang, 'profile', 'list', 'name'
        ) +
        ' "Rafael Dias" ' +
        Dictionary.getTranslateMethodParam(
          _Message.serverConfig.lang, 'profile', 'list', 'country'
        ) +
        ' Brasil ' +
        Dictionary.getTranslateMethodParam(
          _Message.serverConfig.lang, 'profile', 'list', 'age'
        ) +
        ' 34'
      ),
      [
        Dictionary.getMessage(_Message.serverConfig, 'profile', 'HELP_LIST_MULTI_SEARCH'),
      ],
      { breakBottom: 2, }
    )
  },
}