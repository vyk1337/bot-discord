const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'boosters',
    description: 'Affiche la liste des membres qui boostent le serveur',
    async execute(message) {
        await message.guild.members.fetch();
        const boosters = message.guild.members.cache.filter(m => m.premiumSince !== null);

        const embed = new EmbedBuilder()
            .setTitle(`Boosters du serveur (${boosters.size})`)
            .setColor('#f47fff')
            .setDescription(boosters.map(b => `${b} — Boost depuis le <t:${Math.floor(b.premiumSinceTimestamp / 1000)}:R>`).join('\n') || 'Aucun booster sur ce serveur.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
