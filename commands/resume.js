module.exports = {
  name: 'resume',
  description: 'Resume paused music',
  execute(message, args) {
    const { getVoiceConnection } = require('@discordjs/voice');
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) return message.reply('❌ I\'m not in a voice channel.');

    const subscription = connection.state.subscription;
    if (!subscription) return message.reply('⚠️ Nothing to resume.');

    subscription.player.unpause();
    message.reply('▶️ Music resumed.');
  }
};
