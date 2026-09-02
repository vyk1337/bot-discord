const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Expulse un membre',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply('Permission requise.');

        const target = message.mentions.members.first();
        if (!target) return message.reply('Mentionnez un membre à expulser.');

        const reason = args.slice(1).join(' ') || 'Pas de raison';
        await target.kick(reason);

        return message.reply(`🚪 **${target.user.tag}** a été expulsé.`);
    }
};
