const db = require('../../database/db.js');
const { isOwner } = require('../../utils/protectedOwners.js');

module.exports = {
    name: 'unbl',
    description: 'Retire quelqu'un de la blacklist',
    async execute(message, args, client) {
        if (!(await isOwner(message.author.id))) return message.reply('Non autorisé.');

        let blacklist = (await db.get('blacklist')) || {};
        const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('Spécifiez un utilisateur.');

        delete blacklist[target.id];
        await db.set('blacklist', blacklist);

        return message.reply(`✅ **${target.tag}** a été retiré de la blacklist.`);
    }
};
