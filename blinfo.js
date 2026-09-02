const db = require('../../database/db.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'blinfo',
    description: 'Affiche les détails de la blacklist d'un membre',
    async execute(message, args, client) {
        const target = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);
        if (!target) return message.reply('Spécifiez un utilisateur.');

        const blacklist = (await db.get('blacklist')) || {};
        const info = blacklist[target.id];

        if (!info) return message.reply('Ce membre n'est pas dans la blacklist.');

        const embed = new EmbedBuilder()
            .setTitle(`Information Blacklist - ${target.tag}`)
            .addFields(
                { name: 'Raison', value: info.reason },
                { name: 'Date', value: `<t:${Math.floor(info.date / 1000)}:F>` }
            )
            .setColor('#ff4757');

        return message.reply({ embeds: [embed] });
    }
};
