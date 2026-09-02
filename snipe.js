const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'snipe',
    description: 'Affiche le dernier message supprimé dans ce salon',
    async execute(message, args, client) {
        const sniped = client.snipes.get(message.channel.id);
        if (!sniped) return message.reply('Aucun message récemment supprimé à afficher.');

        const embed = new EmbedBuilder()
            .setAuthor({ name: sniped.author.tag, iconURL: sniped.author.displayAvatarURL() })
            .setDescription(sniped.content)
            .setFooter({ text: `Supprimé <t:${Math.floor(sniped.date / 1000)}:R>` })
            .setColor('#2b2d31');

        if (sniped.image) embed.setImage(sniped.image);

        return message.reply({ embeds: [embed] });
    }
};
