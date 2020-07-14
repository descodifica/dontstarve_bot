const Canais = require('./Canais')
const Config = require('./Config')
const Help = require('./Help')

module.exports = {
  ptbr: {
    canais: Canais,
    config: Config,
    ajuda: Help,
  },
  en: {
    channels: Canais,
    config: Config,
    help: Help,
  },
  es: {
    config: Config,
    ayuda: Help,
    canales: Canais,
  },
  zhcn: {
    频道: Canais,
    配置: Config,
    救命: Help,
  },
}