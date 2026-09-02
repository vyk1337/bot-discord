const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'lock',
    description: 'Verrouille un salon',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('Non autorisé.');

        await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
        return message.reply('🔒 Salon verrouillé.');
    }
};
