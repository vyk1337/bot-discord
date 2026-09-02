const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Menu d'aide interactif',
    async execute(message) {
        const embed = new EmbedBuilder()
            .setTitle('📌 Menu d'Aide')
            .setDescription('Sélectionnez une catégorie ci-dessous pour afficher la liste des commandes.\n\n*Pour voir toutes les commandes d'un coup, utilisez `+helpall`.*')
            .setColor('#2b2d31');

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('help_select')
                .setPlaceholder('Choisissez une catégorie...')
                .addOptions([
                    { label: 'Utilitaires', value: 'util', emoji: '🛠️' },
                    { label: 'Contrôle Bot & Owner', value: 'owner', emoji: '👑' },
                    { label: 'Antiraid', value: 'antiraid', emoji: '🛡️' },
                    { label: 'Gestion Serveur', value: 'gestion', emoji: '⚙️' },
                    { label: 'Tickets', value: 'tickets', emoji: '🎫' },
                    { label: 'Logs', value: 'logs', emoji: '📜' },
                    { label: 'Modération', value: 'mod', emoji: '🔨' }
                ])
        );

        const msg = await message.reply({ embeds: [embed], components: [menu] });
        const collector = msg.createMessageComponentCollector({ time: 60000 });

        collector.on('collect', async i => {
            if (i.user.id !== message.author.id) return i.reply({ content: 'Non autorisé', ephemeral: true });

            const catEmbeds = {
                util: new EmbedBuilder().setTitle('🛠️ Utilitaires').setDescription('`+allbots`, `+alladmins`, `+botadmins`, `+boosters`, `+pic`, `+banner`, `+server pic`, `+server banner`, `+snipe`').setColor('#2b2d31'),
                owner: new EmbedBuilder().setTitle('👑 Contrôle Bot & Owner').setDescription('`+setname`, `+setpic`, `+setbanner`, `+setprofil`, `+owner`, `+unowner`, `+clear owners`, `+bl`, `+unbl`, `+blinfo`, `+clear bl`').setColor('#2b2d31'),
                antiraid: new EmbedBuilder().setTitle('🛡️ Antiraid').setDescription('`+raidlog`, `+raidping`, `+antitoken`, `+secur`, `+antichannel`, `+antirole`, `+antiwebhook`, `+clear webhooks`, `+antiunban`, `+antibot`, `+antiban`, `+antieveryone`').setColor('#2b2d31'),
                gestion: new EmbedBuilder().setTitle('⚙️ Gestion Serveur').setDescription('`+giveaway`, `+end giveaway`, `+reroll`, `+choose`, `+embed`, `+backup`, `+renew`').setColor('#2b2d31'),
                tickets: new EmbedBuilder().setTitle('🎫 Tickets').setDescription('`+ticket settings`, `+claim`, `+rename`, `+add`, `+del`, `+close`').setColor('#2b2d31'),
                logs: new EmbedBuilder().setTitle('📜 Logs').setDescription('`+messagelog`, `+voicelog`, `+boostlog`, `+rolelog`, `+raidlog`, `+autoconfiglog`').setColor('#2b2d31'),
                mod: new EmbedBuilder().setTitle('🔨 Modération').setDescription('`+clear`, `+kick`, `+ban`, `+unban`, `+banlist`, `+lock`, `+unlock`, `+hide`, `+unhide`, `+hideall`, `+unhideall`, `+addrole`, `+delrole`, `+derank`').setColor('#2b2d31')
            };

            await i.update({ embeds: [catEmbeds[i.values[0]]] });
        });
    }
};
