const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ping",
  description: "Check the bot latency",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction, lang) => {
    try {
      // Defer the reply if any delay is expected
      await interaction.deferReply();

      // Calculate latency
      const ping = Date.now() - interaction.createdTimestamp;

      // Create embed message
      const embed = new EmbedBuilder()
        .setTitle("🏓 Pong!")
        .setColor("Green")
        .addFields(
          { name: "Bot Latency", value: `${ping}ms`, inline: true },
          { name: "API Latency", value: `${client.ws.ping}ms`, inline: true }
        );

      // Send response after deferring
      await interaction.editReply({ embeds: [embed] });

    } catch (error) {
      console.error("Ping command error:", error);

      // Attempt to send error to user if possible
      if (!interaction.replied) {
        try {
          await interaction.reply({
            content: "❌ An error occurred while executing this command.",
            ephemeral: true,
          });
        } catch (innerErr) {
          console.error("Failed to reply to interaction error:", innerErr);
        }
      }
    }
  },
};
