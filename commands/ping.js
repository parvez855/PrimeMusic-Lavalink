const { EmbedBuilder } = require('discord.js');
const config = require("../config.js");
const musicIcons = require('../UI/icons/musicicons.js');

module.exports = {
  name: "ping",
  description: "Check the bot latency",
  permissions: "0x0000000000000800",
  options: [],
  run: async (client, interaction, lang) => {
    try {
      // Defer the reply to prevent timeout error
      const start = Date.now();
      await interaction.deferReply();

      const end = Date.now();
      const latency = end - start;
      const websocketPing = client.ws.ping;

      const embed = new EmbedBuilder()
        .setColor(config.embedColor)
        .setAuthor({
          name: lang.ping.embed.title,
          iconURL: musicIcons.pingIcon,
          url: "https://discord.gg/xQF9f9yUEM"
        })
        .setDescription(
          `${lang.ping.embed.responseTime.replace("{latency}", latency)}
          \n${lang.ping.embed.websocketPing.replace("{ping}", websocketPing)}
          \n${lang.ping.embed.uptime.replace("{uptime}", formatUptime(client.uptime))}`
        )
        .setFooter({ text: lang.ping.embed.footer, iconURL: musicIcons.heartIcon })
        .setTimestamp();

      // Edit the deferred reply with the embed
      await interaction.editReply({ embeds: [embed] });

    } catch (e) {
      console.error("❌ Ping command error:", e);

      // Try to send a fallback error message
      if (!interaction.replied && !interaction.deferred) {
        try {
          await interaction.reply({
            content: "❌ An error occurred while checking the bot's ping.",
            ephemeral: true
          });
        } catch (err) {
          console.error("❌ Failed to send error message:", err);
        }
      }
    }
  },
};

// Helper function to format uptime
function formatUptime(uptime) {
  const seconds = Math.floor((uptime / 1000) % 60);
  const minutes = Math.floor((uptime / (1000 * 60)) % 60);
  const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
  const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
