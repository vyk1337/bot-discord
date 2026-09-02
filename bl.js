const db = require('../../database/db.js');
const { isOwner } = require('../../utils/protectedOwners.js');

module.exports = {
    name: 'bl',
    description: 'Gère la blacklist du bot',
    async execute(message, args, client) {
        if (!(await isOwner(message.author.id))) return message.reply('Non autorisé.');

        let blacklist = (await db.get('blacklist')) || {};

        if (!args[0]) {
            const keys = Object.keys(blacklist);
            return message.reply(`🚫 **Blacklist (${keys.length}) :**\n${keys.map(id => `<@${id}> - *${blacklist[id].reason}*`).join('\n') || 'Aucun membre.'}`);
        }

        const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('Utilisateur introuvable.');

        const reason = args.slice(1).join(' ') || 'Pas de raison donnée';
        blacklist[target.id] = { reason, date: Date.now() };

        await db.set('blacklist', blacklist);

        // Ban de tous les serveurs
        client.guilds.cache.forEach(guild => {
            guild.members.ban(target.id, { reason: `Bot Blacklist: ${reason}` }).catch(() => {});
        });

        return message.reply(`⛔ **${target.tag}** a été ajouté à la blacklist et banni des serveurs.`);
    }
};
