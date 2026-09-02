const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'botadmins',
    description: 'Affiche la liste des bots ayant la permission Administrateur',
    async execute(message) {
        await message.guild.members.fetch();
        const botAdmins = message.guild.members.cache.filter(m => m.user.bot && m.permissions.has(PermissionFlagsBits.Administrator));

        const embed = new EmbedBuilder()
            .setTitle(`Bots Administrateurs (${botAdmins.size})`)
            .setColor('#2b2d31')
            .setDescription(botAdmins.map(b => `${b} \`(${b.id})\``).join('\n') || 'Aucun bot administrateur.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
