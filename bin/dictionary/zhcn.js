// Adiciona sessão para chinês simplificado ao dicionário
global.Dictionary.add('zhcn', {
  config: {
    name: '建立',
    resume: '在服务器上配置机械手（仅服务器所有者）',
    methods: {
      lang: {
        name: '语言',
        resume: '更改机器人语言',
        doc: [
          '接受值:\n',
          '> de - 德语',
          '> en - 英语',
          '> es - 西班牙文',
          '> fr - 法文',
          '> it > 义大利文',
          '> ptbr - 巴西葡萄牙语',
          '> zhcn - 简体中文',
        ],
      },
    },
    messages: {
      INVALID_LANGUAGE: ({ lang, firstLangs, lastLang, }) => `语言 "${lang}" 无效。 可接受的值是：` +
        `${firstLangs}  ${lastLang}`,
      UPDATED_LANGUAGE: '语言更新成功',
      UPDATE_LANGUAGE_ERROR: '更改语言时出现问题',
    },
  },
  general: {
    messages: {
      COMMAND_NOT_FOUND: ({ command, }) => `命令 "${command}" 不存在`,
      METHOD_NOT_EXISTS: ({ method, }) => `"${method}" 方法不存在`,
      OWNER_CONTROL_ONLY: '该命令只能由服务器所有者使用',
      COMMAND_METHOD_REQUIRED: '有必要将一种方法传递给命令。 输入帮助命令以获取更多详细信息',
      METHODS: '方法',
      METHOD: '方法',
      COMMANDS: '命令',
      COMMAND: '命令',
    },
  },
  help: {
    name: '救命',
    resume: '向机器人及其命令寻求帮助',
    messages: {
      COMMAND_NOT_FOUND: ({ command, prefix, }) => `命令 "${command}" 不存在，输入 ` +
        `"${prefix}救命" 以查看所有命令`,
      METHOD_NOT_FOUND: ({ method, }) => `找不到方法 "${method}"`,
      VIEW_MORE_INFO: ({ prefix, command, method, }) => `查看有关 ${prefix}${command} ${method} ` +
        '的更多信息：',
      NO_INFO_AVAILABLE: '没有可用的额外信息',
      VIEW_ALL: ({ word, }) => `在这里看到所有可用的 ${word} 的列表`,
      VIEW_MORE_DETAILS: ({ command, word, }) => `输入 "${command}" ，然后输入 ${word} ` +
        '以获取更多详细信息',
    },
  },
})