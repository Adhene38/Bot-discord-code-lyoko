const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("💻 Réautoriser l'accès au réseau (unban) d'un utilisateur")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("L'ID Discord de l'utilisateur à réintégrer")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison du rétablissement d'accès")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const userId = interaction.options.getString("userid");
    const raison =
      interaction.options.getString("raison") || "Aucune raison fournie";

    try {
      const banInfo = await interaction.guild.bans.fetch(userId);

      if (!banInfo) {
        return interaction.reply({
          content: `Erreur de base de données : Je ne trouve aucun ban pour l'ID **${userId}** ! 😅💻`,
          ephemeral: true,
        });
      }

      await interaction.guild.members.unban(userId, raison);

      const embed = {
        color: 0x58d68d, // Vert pour le succès de la procédure
        title: "💻 Supercalculateur — Accès Rétabli",
        description: `Transfert réussi !! **${banInfo.user.tag}** est de nouveau autorisé sur le réseau !! 🎉⚡`,
        fields: [
          { name: "👤 Utilisateur", value: `${banInfo.user.tag}`, inline: true },
          { name: "🛡️ Opérateur", value: `<@${interaction.user.id}>`, inline: true },
          { name: "📝 Note technique", value: raison },
        ],
        footer: { text: "Interface Jérémie Belpois — Code Lyoko" },
        timestamp: new Date().toISOString(),
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "Erreur critique ! 😅💻 Je ne trouve pas ce ban ou le Supercalculateur a un bug. Vérifie bien l'ID !",
        ephemeral: true,
      });
    }
  },
};
