module.exports = {
    name: 'close',
    description: 'Ferme le ticket actuel',
    async execute(message) {
        if (!message.channel.name.startsWith('ticket-')) {
            return message.reply('Cette commande ne peut être utilisée que dans un ticket.');
        }

        await message.reply('🔒 Fermeture du ticket dans 5 secondes...');
        setTimeout(() => message.channel.delete().catch(() => {}), 5000);
    }
};
