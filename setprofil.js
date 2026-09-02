const { isOwner } = require('../../utils/protectedOwners.js');

module.exports = {
    name: 'setprofil',
    description: 'Modifie le nom et l'avatar du bot d'un coup',
    async execute(message, args, client) {
        if (!(await isOwner(message.author.id))) return message.reply('Seuls les Owners peuvent faire cela.');

        const name = args[0];
        const avatar = args[1];

        if (!name || !avatar) return message.reply('Usage : `+setprofil <nom> <url_avatar>`');

        try {
            await client.user.setUsername(name);
            await client.user.setAvatar(avatar);
            return message.reply('✅ Profil du bot mis à jour avec succès !');
        } catch (e) {
            return message.reply(`❌ Erreur lors de la mise à jour : ${e.message}`);
        }
    }
};
