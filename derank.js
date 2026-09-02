const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'derank',
    description: 'Supprime tous les rôles d'un membre',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply('Non autorisé.');

        const target = message.mentions.members.first();
        if (!target) return message.reply('Mentionnez un membre.');

        await target.roles.set([]);
        return message.reply(`🗑️ Tous les rôles de **${target.user.tag}** ont été retirés.`);
    }
};
