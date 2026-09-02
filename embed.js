const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'embed',
    description: 'Crée un embed personnalisé (format: titre | description | couleur)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply('Non autorisé.');

        const content = args.join(' ').split('|');
        const title = content[0]?.trim() || 'Titre';
        const desc = content[1]?.trim() || 'Description';
        const color = content[2]?.trim() || '#2b2d31';

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(desc)
            .setColor(color);

        await message.channel.send({ embeds: [embed] });
        await message.delete().catch(() => {});
    }
};
