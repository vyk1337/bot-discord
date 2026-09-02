const db = require('../../database/db.js');

module.exports = {
    name: 'messagelog',
    description: 'Active ou désactive les logs de messages',
    async execute(message, args) {
        const mode = args[0]?.toLowerCase();

        if (mode === 'off') {
            await db.delete(`logs_${message.guild.id}.messagelog`);
            return message.reply('🛑 Logs de messages désactivés.');
        }

        if (mode === 'on') {
            const channel = message.mentions.channels.first() || message.channel;
            await db.set(`logs_${message.guild.id}.messagelog`, channel.id);
            return message.reply(`✅ Logs de messages activés dans ${channel}.`);
        }

        return message.reply('Usage : `+messagelog on [salon]` ou `+messagelog off`');
    }
};
