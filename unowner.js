const db = require('../../database/db.js');
const { isOwner } = require('../../utils/protectedOwners.js');

module.exports = {
    name: 'unowner',
    description: 'Retire le grade Owner à quelqu'un',
    async execute(message, args, client) {
        if (!(await isOwner(message.author.id)) && message.author.id !== message.guild.ownerId) {
            return message.reply('❌ Seuls les Owners peuvent exécuter cette commande.');
        }

        let owners = (await db.get('owners')) || [];
        const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('Spécifiez un membre ou un ID.');

        owners = owners.filter(id => id !== target.id);
        await db.set('owners', owners);

        return message.reply(`✅ **${target.tag}** n'est plus Owner du bot.`);
    }
};
