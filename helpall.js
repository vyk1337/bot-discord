const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'helpall',
    description: 'Affiche toutes les commandes',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('📚 Liste Complète des Commandes')
            .setColor('#2b2d31')
            .addFields(
                { name: '🛠️ Utilitaires', value: '`+allbots`, `+alladmins`, `+botadmins`, `+boosters`, `+pic`, `+banner`, `+server pic`, `+server banner`, `+snipe`', inline: false },
                { name: '👑 Contrôle Bot & Owner', value: '`+setname`, `+setpic`, `+setbanner`, `+setprofil`, `+owner`, `+unowner`, `+clear owners`, `+bl`, `+unbl`, `+blinfo`, `+clear bl`', inline: false },
                { name: '🛡️ Antiraid', value: '`+raidlog`, `+raidping`, `+antitoken`, `+secur`, `+antichannel`, `+antirole`, `+antiwebhook`, `+clear webhooks`, `+antiunban`, `+antibot`, `+antiban`, `+antieveryone`', inline: false },
                { name: '⚙️ Gestion Serveur', value: '`+giveaway`, `+end giveaway`, `+reroll`, `+choose`, `+embed`, `+backup`, `+renew`', inline: false },
                { name: '🎫 Tickets', value: '`+ticket settings`, `+claim`, `+rename`, `+add`, `+del`, `+close`', inline: false },
                { name: '📜 Logs', value: '`+messagelog`, `+voicelog`, `+boostlog`, `+rolelog`, `+raidlog`, `+autoconfiglog`', inline: false },
                { name: '🔨 Modération', value: '`+clear`, `+kick`, `+ban`, `+unban`, `+banlist`, `+lock`, `+unlock`, `+hide`, `+unhide`, `+hideall`, `+unhideall`, `+addrole`, `+delrole`, `+derank`', inline: false }
            )
            .setFooter({ text: 'Préfixe : +' });

        return message.reply({ embeds: [embed] });
    }
};
