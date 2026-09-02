const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'alladmins',
    description: 'Affiche la liste des membres ayant la permission Administrateur',
    async execute(message) {
        await message.guild.members.fetch();
        const admins = message.guild.members.cache.filter(m => !m.user.bot && m.permissions.has(PermissionFlagsBits.Administrator));

        const embed = new EmbedBuilder()
            .setTitle(`Administrateurs Humains (${admins.size})`)
            .setColor('#2b2d31')
            .setDescription(admins.map(a => `${a} \`(${a.id})\``).join('\n') || 'Aucun administrateur trouvé.')
            .setTimestamp();

        return message.reply({ embeds: [embed] });
    }
};
