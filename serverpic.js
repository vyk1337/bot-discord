const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'server pic',
    description: 'Affiche l'icône du serveur',
    async execute(message) {
        const icon = message.guild.iconURL({ dynamic: true, size: 1024 });
        if (!icon) return message.reply('Ce serveur n'a pas d'icône.');

        const embed = new EmbedBuilder()
            .setTitle(`Icône de ${message.guild.name}`)
            .setImage(icon)
            .setColor('#2b2d31');

        return message.reply({ embeds: [embed] });
    }
};
