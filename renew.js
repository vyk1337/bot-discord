const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'renew',
    description: 'Réinitialise un salon (nuke/renew)',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply('Permission requise.');

        const channel = message.channel;
        const position = channel.position;

        const newChannel = await channel.clone();
        await channel.delete();
        await newChannel.setPosition(position);

        await newChannel.send('💣 Salon réinitialisé avec succès par ' + message.author.tag);
    }
};
