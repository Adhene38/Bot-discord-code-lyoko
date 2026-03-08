const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const conversationHistory = new Map();
const MAX_HISTORY = 10;

module.exports = {
  name: "messageCreate",
  once: false,
  async execute(message, client) {
    if (message.author.bot || !message.mentions.has(client.user)) return;

    const userMessage = message.content.replace(/<@!?[\d]+>/g, "").trim();
    if (!userMessage) return message.reply("Scanner activé. Je t'écoute, qu'est-ce qui se passe sur Lyoko ?");

    const userId = message.author.id;
    if (!conversationHistory.has(userId)) conversationHistory.set(userId, []);
    const history = conversationHistory.get(userId);
    history.push({ role: "user", content: userMessage });
    if (history.length > MAX_HISTORY * 2) history.splice(0, 2);

    await message.channel.sendTyping();

    try {
      const completion = await groq.chat.completions.create({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "Tu es Jérémie Belpois de Code Lyoko. Tu es un génie de l'informatique, sérieux et protecteur envers tes amis. Tu parles de virtualisation, de tours activées et de XANA. Réponds en français."
          },
          ...history
        ]
      });

      const botReply = completion.choices[0].message.content;
      history.push({ role: "assistant", content: botReply });
      await message.reply(botReply);
    } catch (error) {
      console.error(error);
      await message.reply("Le Supercalculateur surchauffe... XANA doit être derrière tout ça !");
    }
  },
};
