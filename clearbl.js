const db = require('../../database/db.js');
const { isOwner } = require('../../utils/protectedOwners.js');

module.exports = {
    name: 'clear bl',
    description: 'Vide toute la blacklist du bot',
    async execute(message) {
        if (!(await isOwner(message.author.id))) return message.reply('Non autorisé.');

        await db.set('blacklist', {});
        return message.reply('✅ La blacklist a été intégralement réinitialisée.');
    }
};
