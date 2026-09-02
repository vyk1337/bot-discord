const db = require('../../database/db.js');

module.exports = {
    name: 'clear owners',
    description: 'Supprime tous les owners du bot',
    async execute(message) {
        if (message.author.id !== message.guild.ownerId) {
            return message.reply('❌ Seul le propriétaire du serveur peut exécuter cette commande.');
        }

        await db.set('owners', []);
        return message.reply('✅ La liste des owners a été réinitialisée.');
    }
};
