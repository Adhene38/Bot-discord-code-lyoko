const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("💖 Débannir un utilisateur")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("L'ID Discord de l'utilisateur à débannir")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison du unban")
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
          content: `Hmm, je trouve pas de ban pour cet ID ! 😅💎 Vérifie bien l'ID Discord.`,
          ephemeral: true,
        });
      }

      await interaction.guild.members.unban(userId, raison);

      const embed = {
        color: 0x58d68d,
        title: "💖 Crystal Gems — Débannissement !",
        description: `YAY !! **${banInfo.user.tag}** peut revenir dans le serveur !! 🎉✨ Tout le monde mérite une seconde chance !!`,
        fields: [
          { name: "👤 Utilisateur", value: `${banInfo.user.tag}`, inline: true },
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
        content: "Oups ! Je trouve pas ce ban, ou ma gemme a glitché 😅💎 Vérifie l'ID !",
        ephemeral: true,
      });
    }
  },
};
