const db = require('../../database/db.js');

module.exports = {
    name: 'antichannel',
    description: 'Active/Désactive l'antichannel',
    async execute(message, args) {
        const mode = args[0]?.toLowerCase();
        if (!['off', 'on', 'max'].includes(mode)) return message.reply('Usage : `+antichannel <off/on/max>`');

        await db.set(`antiraid_${message.guild.id}.antichannel`, mode === 'off' ? false : mode);
        return message.reply(`🛡️ Module **Antichannel** réglé sur : **${mode.toUpperCase()}**`);
    }
};
