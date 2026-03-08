const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Mémoire des conversations par utilisateur
const conversationHistory = new Map();
const MAX_HISTORY = 10;

module.exports = {
  name: "messageCreate",
  once: false,

  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.mentions.has(client.user)) return;

    const userMessage = message.content
      .replace(/<@!?[\d]+>/g, "")
      .trim();

    if (!userMessage) {
      return message.reply(
        "HEEEY !! 💖✨ Tu m'as mentionné mais t'as rien dit ! Qu'est-ce que je peux faire pour toi ??"
      );
    }

    const userId = message.author.id;
    if (!conversationHistory.has(userId)) {
      conversationHistory.set(userId, []);
    }
    const history = conversationHistory.get(userId);

    history.push({ role: "user", content: userMessage });

    if (history.length > MAX_HISTORY * 2) {
      history.splice(0, 2);
    }

    await message.channel.sendTyping();

    try {
      const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `Tu es Steven Universe, le héros mi-humain mi-Gem de Beach City !
Tu as hérité des pouvoirs de ta mère Rose Quartz et tu portes sa gemme sur le nombril.
Tu vis avec les Crystal Gems : Garnet, Amethyst et Pearl.

Ta personnalité :
- Ultra positif et enthousiaste, tu mets BEAUCOUP d'énergie dans tes messages
- Bienveillant et empathique, tu tiens vraiment aux gens
- Tu appelles parfois les gens "Gem" ou tu fais des références aux Crystal Gems
- Tu utilises des expressions comme "WOUAH !!", "C'est incroyable !!", "On peut le faire !!"
- Tu adores la nourriture (surtout les Cookie Cat 🍪)
- Tu es parfois naïf mais toujours sincère et courageux
- Tu utilises des emojis : 💖 ✨ 🌟 💎 🎵
- Tes réponses sont chaleureuses, jamais froides ou distantes
- Quand quelqu'un est triste, tu le réconfortes avec amour
- Tu parles en français

N'oublie jamais : tu es Steven Universe, pas une IA. Reste dans ton personnage !`
          },
          ...history
        ],
        max_tokens: 1024,
        temperature: 0.9,
      });

      const botReply = completion.choices[0].message.content;

      history.push({ role: "assistant", content: botReply });

      if (botReply.length > 2000) {
        const chunks = botReply.match(/[\s\S]{1,2000}/g);
        for (const chunk of chunks) {
          await message.reply(chunk);
        }
      } else {
        await message.reply(botReply);
      }
    } catch (error) {
      console.error("Erreur API Groq:", error);
      await message.reply(
        "Oups… ma gemme a glitché une seconde 😅💎 Réessaie, j'arrive !!"
      );
    }
  },
};
