const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'allbots',
    description: 'Affiche la liste des bots présents sur le serveur',
    async execute(message) {
        await message.guild.members.fetch();
        const bots = message.guild.members.cache.filter(m => m.user.bot);

        const embed = new EmbedBuilder()
            .setTitle(`Bots sur le serveur (${bots.size})`)
            .setColor('#2b2d31')
            .setDescription(bots.map(b => `${b} \`(${b.id})\``).join('\n') || 'Aucun bot trouvé.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
