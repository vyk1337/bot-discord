const db = require('../../database/db.js');

module.exports = {
    name: 'raidlog',
    description: 'Définit le salon des logs antiraid',
    async execute(message, args) {
        if (args[0] === 'off') {
            await db.delete(`antiraid_${message.guild.id}.raidlog`);
            return message.reply('🛑 Logs d'antiraid désactivés.');
        }

        const channel = message.mentions.channels.first() || message.channel;
        await db.set(`antiraid_${message.guild.id}.raidlog`, channel.id);
        return message.reply(`✅ Salon des logs d'antiraid défini sur ${channel}.`);
    }
};
