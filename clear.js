const { PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'clear',
    description: 'Supprime un nombre de messages dans le salon',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply('Permission requise.');

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) return message.reply('Indiquez un nombre entre 1 et 100.');

        const target = message.mentions.users.first();
        await message.delete().catch(() => {});

        let messages = await message.channel.messages.fetch({ limit: amount });
        if (target) {
            messages = messages.filter(m => m.author.id === target.id);
        }

        await message.channel.bulkDelete(messages, true).catch(() => {});
        const reply = await message.channel.send(`🧹 **${messages.size}** message(s) supprimé(s).`);
        setTimeout(() => reply.delete().catch(() => {}), 3000);
    }
};
