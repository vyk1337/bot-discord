const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'banner',
    description: 'Affiche la bannière d'un membre',
    async execute(message, args) {
        const target = message.mentions.users.first() || await message.client.users.fetch(args[0]).catch(() => null) || message.author;
        const fetchedUser = await target.fetch(true);

        if (!fetchedUser.banner) {
            return message.reply('Ce membre n'a pas de bannière.');
        }

        const bannerUrl = fetchedUser.bannerURL({ dynamic: true, size: 1024 });

        const embed = new EmbedBuilder()
            .setTitle(`Bannière de ${target.username}`)
            .setImage(bannerUrl)
            .setColor('#2b2d31');

        return message.reply({ embeds: [embed] });
    }
};
