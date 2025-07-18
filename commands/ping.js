const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Check the bot latency',
  permissions: '0x0000000000000800',
  options: [],
  run: async (client, interaction) => {
    try {
      // Immediately defer reply to prevent interaction expiry (3s timeout)
      await interaction.deferReply({ ephemeral: true });

      // Create latency data
      const botLatency = Date.now() - interaction.createdTimestamp;
      const apiLatency = client.ws.ping;

      // Build the embed
      const embed = new EmbedBuilder()
        .setTitle('🏓 Hello Baby!')
        .setColor('Green')
        .addFields(
          { name: 'Bot Latency', value: `${botLatency}ms`, inline: true },
          { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      // Send the reply after deferring
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error('❌ Ping Command Error:', error);

      // If something failed and interaction not replied/deferred yet
      if (!interaction.deferred && !interaction.replied) {
        try {
          await interaction.reply({
            content: '⚠️ An error occurred while executing this command.',
            ephemeral: true
          });
        } catch (innerError) {
          console.error('⚠️ Failed to send fallback reply:', innerError);
        }
      }
    }
  },
};
