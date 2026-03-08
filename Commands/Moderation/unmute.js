const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("💖 Retirer la sourdine d'un membre")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Le membre à démuter")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison du unmute")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const membre = interaction.options.getMember("membre");
    const raison =
      interaction.options.getString("raison") || "Aucune raison fournie";

    if (!membre) {
      return interaction.reply({
        content: "Hé, ce membre n'existe pas ! 😅💎",
        ephemeral: true,
      });
    }

    if (!membre.isCommunicationDisabled()) {
      return interaction.reply({
        content: `**${membre.user.tag}** n'est pas muté ! 😄✨`,
        ephemeral: true,
      });
    }

    try {
      await membre.timeout(null, raison);

      const embed = {
        color: 0x58d68d,
        title: "💖 Crystal Gems — Sourdine retirée !",
        description: `YAY !! **${membre.user.tag}** peut parler à nouveau !! 🎉✨ Bienvenue de retour dans la communauté !!`,
        fields: [
          { name: "👤 Membre", value: `<@${membre.id}>`, inline: true },
          { name: "🛡️ Modérateur", value: `<@${interaction.user.id}>`, inline: true },
          { name: "📝 Raison", value: raison },
        ],
        footer: { text: "Steven Universe Bot 💎✨" },
        timestamp: new Date().toISOString(),
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Oups ! Ma gemme a glitché 😅💎 J'ai pas pu démuter ce membre…",
        ephemeral: true,
      });
    }
  },
};
