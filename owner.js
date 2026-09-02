const db = require('../../database/db.js');
const { isOwner } = require('../../utils/protectedOwners.js');

module.exports = {
    name: 'owner',
    description: 'Gère la liste des owners du bot',
    async execute(message, args, client) {
        if (!(await isOwner(message.author.id)) && message.author.id !== message.guild.ownerId) {
            return message.reply('❌ Seuls les Owners du bot peuvent exécuter cette commande.');
        }

        let owners = (await db.get('owners')) || [];

        if (!args[0]) {
            return message.reply(`👑 **Owners du bot :**\n${owners.map(id => `<@${id}> (\`${id}\`)`).join('\n') || 'Aucun owner défini.'}`);
        }

        const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('Utilisateur introuvable.');

        if (!owners.includes(target.id)) {
            owners.push(target.id);
            await db.set('owners', owners);
            return message.reply(`✅ **${target.tag}** est désormais Owner du bot.`);
        } else {
            return message.reply('Cet utilisateur est déjà Owner.');
        }
    }
};
