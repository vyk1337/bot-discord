const db = require('../../database/db.js');

module.exports = {
    name: 'antitoken',
    description: 'Règle la sensibilité ou le statut de l'antitoken',
    async execute(message, args) {
        const mode = args[0]?.toLowerCase();
        if (mode === 'on') {
            await db.set(`antiraid_${message.guild.id}.antitoken`, { limit: 5, duration: 10 });
            return message.reply('✅ Antitoken **ON** (Limitation par défaut : 5 membres / 10s).');
        } else if (mode === 'off') {
            await db.set(`antiraid_${message.guild.id}.antitoken`, false);
            return message.reply('🛑 Antitoken **OFF**.');
        } else if (mode === 'lock') {
            await db.set(`antiraid_${message.guild.id}.antitoken`, 'lock');
            return message.reply('🔒 Serveur verrouillé. Tout nouveau membre sera expulsé instantanément.');
        }

        if (args[0] && args[0].includes('/')) {
            const [limit, duration] = args[0].split('/').map(Number);
            if (isNaN(limit) || isNaN(duration)) return message.reply('Format invalide (ex: `+antitoken 5/10`).');

            await db.set(`antiraid_${message.guild.id}.antitoken`, { limit, duration });
            return message.reply(`✅ Antitoken réglé : **${limit}** personnes en **${duration}** secondes.`);
        }

        return message.reply('Usage : `+antitoken <on/off/lock>` ou `+antitoken <nombre>/<durée_en_sec>`');
    }
};
