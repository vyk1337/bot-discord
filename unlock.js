const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'unlock',
    description: 'Déverrouille un salon',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('Non autorisé.');

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: true });
        return message.reply('🔓 Salon déverrouillé.');
    }
};
