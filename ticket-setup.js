const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'ticket settings',
    description: 'Envoie l'panel de création de tickets',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('Admin requis.');

        const embed = new EmbedBuilder()
            .setTitle('🎫 Support / Tickets')
            .setDescription('Cliquez sur le bouton ci-dessous pour ouvrir un ticket de support.')
            .setColor('#2b2d31');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('open_ticket')
                .setLabel('Ouvrir un ticket')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🎫')
        );

        return message.channel.send({ embeds: [embed], components: [row] });
    }
};
