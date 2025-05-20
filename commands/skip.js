const { getQueue, playNext } = require('../music/queue');

module.exports = {
  name: 'skip',
  aliases: ['s'],
  description: 'Skip the currently playing song',
  execute(message, args) {
    const queue = getQueue(message.guild.id);
    if (!queue || !queue.playing) {
      return message.reply('⚠️ Nothing is playing.');
    }

    queue.player.stop(); // will trigger 'Idle' and auto-play next
    message.reply('⏭️ Skipped.');
  }
};
