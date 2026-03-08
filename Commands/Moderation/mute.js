const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("💎 Mettre en sourdine un membre du serveur")
    .addUserOption((option) =>
      option
        .setName("membre")
        .setDescription("Le membre à muter")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duree")
        .setDescription("Durée du mute (ex: 10m, 1h, 1d)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("raison")
        .setDescription("Raison du mute")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const membre = interaction.options.getMember("membre");
    const dureeStr = interaction.options.getString("duree");
    const raison =
      interaction.options.getString("raison") || "Aucune raison fournie";

    // Vérifications
    if (!membre) {
      return interaction.reply({
        content: "Hé, ce membre n'existe pas ! 😅💎",
        ephemeral: true,
      });
    }

    if (membre.id === interaction.user.id) {
      return interaction.reply({
        content: "ATTENDS !! 😱 Tu peux pas te muter toi-même !! C'est pas comme ça que les Crystal Gems font les choses ! 💖",
        ephemeral: true,
      });
    }

    if (membre.id === client.user.id) {
      return interaction.reply({
        content: "Hé ! Tu essaies de me muter MOI ?! 😤💎 C'est pas cool ça !",
        ephemeral: true,
      });
    }

    if (!membre.moderatable) {
      return interaction.reply({
        content: "Oups… je peux pas muter cette personne, elle a trop de pouvoir ! 😅✨ Demande à un admin !",
        ephemeral: true,
      });
    }

    // Convertir la durée en millisecondes
    const dureeMs = parseDuration(dureeStr);
    if (!dureeMs) {
      return interaction.reply({
        content: "Hmmm je comprends pas cette durée 😅💎 Utilise: `10m`, `1h`, `1d`, `7d` (max 28 jours !)",
        ephemeral: true,
      });
    }

    if (dureeMs > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({
        content: "Woah woah woah !! 😱 Discord autorise pas plus de 28 jours de mute ! 💎",
        ephemeral: true,
      });
    }

    try {
      await membre.timeout(dureeMs, raison);

      const embed = {
        color: 0xf4d03f,
        title: "💎 Crystal Gems — Mise en sourdine",
        description: `Hé **${membre.user.tag}**… j'espère que tu vas réfléchir pendant ce temps 💛`,
        fields: [
          { name: "👤 Membre", value: `<@${membre.id}>`, inline: true },
          { name: "⏱️ Durée", value: dureeStr, inline: true },
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
        content: "Oups ! Ma gemme a glitché 😅💎 J'ai pas pu muter ce membre…",
        ephemeral: true,
      });
    }
  },
};

function parseDuration(str) {
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;
  const value = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * multipliers[unit];
}
