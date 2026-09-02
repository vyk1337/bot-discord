const db = require('../../database/db.js');

module.exports = {
    name: 'voicelog',
    description: 'Active ou désactive les logs vocaux',
    async execute(message, args) {
        const mode = args[0]?.toLowerCase();

        if (mode === 'off') {
            await db.delete(`logs_${message.guild.id}.voicelog`);
            return message.reply('🛑 Logs vocaux désactivés.');
        }

        if (mode === 'on') {
            const channel = message.mentions.channels.first() || message.channel;
            await db.set(`logs_${message.guild.id}.voicelog`, channel.id);
            return message.reply(`✅ Logs vocaux activés dans ${channel}.`);
        }

        return message.reply('Usage : `+voicelog on [salon]` ou `+voicelog off`');
    }
};
