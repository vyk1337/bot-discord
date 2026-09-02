const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'pic',
    description: 'Affiche la photo de profil d'un membre',
    async execute(message, args) {
        const target = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null) || message.author;
        const avatarUrl = target.displayAvatarURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setTitle(`Avatar de ${target.username}`)
            .setImage(avatarUrl)
            .setColor('#2b2d31');

        return message.reply({ embeds: [embed] });
    }
};
