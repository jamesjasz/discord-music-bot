// commands/queue.js
const { getQueue } = require('../music/queue');

module.exports = {
  name: 'queue',
  aliases: ['q'],
  description: 'View the current song queue',
  execute(message, args) {
    const queue = getQueue(message.guild.id);
    if (!queue || queue.songs.length === 0) {
      return message.reply('📭 Queue is empty.');
    }

    const list = queue.songs.map((s, i) => `${i === 0 ? '▶️' : `${i + 1}.`} ${s.title}`).join('\n');
    message.reply(`🎶 **Current Queue:**\n${list}`);
  }
};
