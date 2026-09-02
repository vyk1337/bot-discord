const db = require('../../database/db.js');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'secur',
    description: 'Affiche ou modifie tous les paramètres antiraid',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('Permission Admin requise.');

        const guildId = message.guild.id;
        const state = args[0]?.toLowerCase();

        if (state === 'on' || state === 'off' || state === 'max') {
            const val = state === 'off' ? false : state;
            await db.set(`antiraid_${guildId}.antichannel`, val);
            await db.set(`antiraid_${guildId}.antirole`, val);
            await db.set(`antiraid_${guildId}.antiwebhook`, val);
            await db.set(`antiraid_${guildId}.antiunban`, val);
            await db.set(`antiraid_${guildId}.antibot`, val);
            await db.set(`antiraid_${guildId}.antieveryone`, val);

            return message.reply(`🛡️ Tous les modules de sécurité sont désormais configurés sur **${state.toUpperCase()}**.`);
        }

        const config = (await db.get(`antiraid_${guildId}`)) || {};

        const embed = new EmbedBuilder()
            .setTitle(`🛡️ Configuration Sécurité & Antiraid - ${message.guild.name}`)
            .setColor('#2b2d31')
            .addFields(
                { name: 'Antichannel', value: `${config.antichannel || 'off'}`, inline: true },
                { name: 'Antirole', value: `${config.antirole || 'off'}`, inline: true },
                { name: 'Antiwebhook', value: `${config.antiwebhook || 'off'}`, inline: true },
                { name: 'Antiunban', value: `${config.antiunban || 'off'}`, inline: true },
                { name: 'Antibot', value: `${config.antibot || 'off'}`, inline: true },
                { name: 'Antieveryone', value: `${config.antieveryone || 'off'}`, inline: true },
                { name: 'Antitoken', value: `${config.antitoken ? 'Actif' : 'off'}`, inline: true }
            );

        return message.reply({ embeds: [embed] });
    }
};
