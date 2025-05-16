const { getQueue } = require('../music/queue');

module.exports = {
  name: 'volume',
  description: 'Set the volume (0.0 to 1.0)',
  execute(message, args) {
    const volume = parseFloat(args[0]);
    if (isNaN(volume) || volume < 0 || volume > 1) {
      return message.reply('🔈 Please provide a number between 0.0 and 1.0');
    }

    const queue = getQueue(message.guild.id);
    if (!queue || !queue.playing) {
      return message.reply('❌ Nothing is playing.');
    }

    const currentResource = queue.player.state.resource;
    if (!currentResource || !currentResource.volume) {
      return message.reply('⚠️ Cannot change volume at this moment.');
    }

    currentResource.volume.setVolume(volume);
    message.reply(`🔊 Volume set to **${volume}**`);
  }
};
