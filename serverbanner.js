const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'server banner',
    description: 'Affiche la bannière du serveur',
    async execute(message) {
        const banner = message.guild.bannerURL({ dynamic: true, size: 1024 });
        if (!banner) return message.reply('Ce serveur n'a pas de bannière.');

        const embed = new EmbedBuilder()
            .setTitle(`Bannière de ${message.guild.name}`)
            .setImage(banner)
            .setColor('#2b2d31');

        return message.reply({ embeds: [embed] });
    }
};
