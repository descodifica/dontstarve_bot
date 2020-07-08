const languages = [ 'ptbr', 'en', ]
// Resolve uma mensagem em seu idioma correto
module.exports = (_lang, _msgs = {}) => {
  languages.map(lang => {
    if (!_msgs[lang]) {
      console.log(`Faltando idioma ${lang}`)
    }
  })

  return _msgs[_lang]
}