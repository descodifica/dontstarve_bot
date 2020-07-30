// Adiciona sessão para francês ao dicionário
global.Dictionary.add('fr', {
  config: {
    name: 'installer',
    resume: 'Configure le robot sur le serveur (propriétaire du serveur uniquement)',
    methods: {
      lang: {
        name: 'langue',
        resume: 'Changer la langue du Robot',
        doc: [
          'Accepte les valeurs:\n',
          '> de - Allemand',
          '> en - Anglais',
          '> es - Espagnol',
          '> fr - Français',
          '> it - Italien',
          '> ptbr - Portugais Brésilien',
          '> zhcn - Chinois simplifié',
        ],
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `la langue "${lang}" n'est pas ` +
        `valide. Les valeurs acceptées sont: ${firstLangs} et ${lastLang}`,
      UPDATED_LANGUAGE: 'langue mise à jour avec succès',
      UPDATE_LANGUAGE_ERROR: 'un problème est survenu lors du changement de langue',
    },
  },
  general: {
    messages: {
      COMMAND_NOT_FOUND: ({ command, }) => `la commande "${command}" n'existe pas`,
      METHOD_NOT_EXISTS: ({ method, }) => `la méthode "${method}" n'existe pas`,
      OWNER_CONTROL_ONLY: 'cette commande ne peut être utilisée que par le propriétaire du ' +
        'serveur!',
      COMMAND_METHOD_REQUIRED: 'Il faut passer une méthode à la commande. Entrez commande ' +
        'd\'aide pour plus de détails',
      METHODS: 'méthodes',
      METHOD: 'méthode',
      COMMANDS: 'commandes',
      COMMAND: 'commander',
    },
  },
  help: {
    name: 'aide',
    resume: 'Demandez de l\'aide au Bot et à ses commandes',
    messages: {
      COMMAND_NOT_FOUND: ({ command, prefix, }) => `la commande" ${command} "n'existe pas, entre` +
        `"${prefix}aide" pour voir toutes les commandes`,
      METHOD_NOT_FOUND: ({ method, }) => `Méthode "${method}" introuvable`,
      VIEW_MORE_INFO: ({ prefix, command, method, }) => `Voir plus d'informations sur ${prefix} ` +
        `${command} ${method}:`,
      NO_INFO_AVAILABLE: 'Aucune information supplémentaire disponible',
      VIEW_ALL: ({ word, }) => 'voir ici une liste de tous les $ {word} disponibles',
      VIEW_MORE_DETAILS: ({ command, word, }) => `Entrez "${command}" suivi d'un ${word} pour ` +
        'avoir plus de détails',
    },
  },
})