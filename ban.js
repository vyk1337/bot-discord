const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Bannit un membre',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply('Permission de bannir requise.');

        const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('Spécifiez un utilisateur.');

        const reason = args.slice(1).join(' ') || 'Pas de raison spécifiée';
        await message.guild.members.ban(target.id, { reason });

        return message.reply(`🔨 **${target.tag}** a été banni pour : *${reason}*`);
    }
};
