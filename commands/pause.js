module.exports = {
  name: 'pause',
  description: 'Pause the currently playing song',
  execute(message, args) {
    const { getVoiceConnection } = require('@discordjs/voice');
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return message.reply('❌ I\'m not in a voice channel.');

    const subscription = connection.state.subscription;
    if (!subscription) return message.reply('⚠️ Nothing is playing.');

    subscription.player.pause();
    message.reply('⏸️ Music paused.');
  }
};
