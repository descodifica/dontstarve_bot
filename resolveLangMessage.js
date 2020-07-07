// Resolve uma mensagem em seu idioma correto
module.exports = (_lang, _msgs = {}) => {
  return _msgs[_lang]
}