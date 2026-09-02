const { ChannelType, PermissionFlagsBits } = require('discord.js');
const db = require('../../database/db.js');

module.exports = {
    name: 'autoconfiglog',
    description: 'Crée automatiquement une catégorie et des salons de logs',
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return message.reply('Admin requis.');

        const category = await message.guild.channels.create({
            name: '📊 LOGS BOT',
            type: ChannelType.GuildCategory
        });

        const msgLog = await message.guild.channels.create({ name: '💬-log-messages', parent: category.id });
        const voiceLog = await message.guild.channels.create({ name: '🔊-log-vocal', parent: category.id });
        const raidLog = await message.guild.channels.create({ name: '🛡️-log-antiraid', parent: category.id });

        await db.set(`logs_${message.guild.id}.messagelog`, msgLog.id);
        await db.set(`logs_${message.guild.id}.voicelog`, voiceLog.id);
        await db.set(`antiraid_${message.guild.id}.raidlog`, raidLog.id);

        return message.reply('✅ Catégorie et salons de logs créés et configurés automatiquement !');
    }
};
