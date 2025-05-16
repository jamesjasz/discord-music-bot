// music/queue.js

const { createAudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

const queues = new Map();

function createGuildQueue(guildId) {
  const queue = {
    voiceChannel: null,
    connection: null,
    player: createAudioPlayer(),
    songs: [],
    playing: false
  };

  queue.player.on(AudioPlayerStatus.Idle, () => {
    queue.songs.shift(); // remove the current song
    if (queue.songs.length > 0) {
      playNext(guildId);
    } else {
      queue.playing = false;
      queue.connection.destroy();
      queues.delete(guildId);
    }
  });

  queue.player.on('error', error => {
    console.error(`Audio Player Error: ${error.message}`);
    queue.songs.shift(); // skip song
    playNext(guildId);
  });

  queues.set(guildId, queue);
  return queue;
}

async function playNext(guildId) {
  const queue = queues.get(guildId);
  if (!queue || queue.songs.length === 0) return;

  const song = queue.songs[0];
  const stream = ytdl(song.url, {
    filter: 'audioonly',
    quality: 'highestaudio',
    highWaterMark: 1 << 25,
  });

  const resource = createAudioResource(stream, { inlineVolume: true });
  resource.volume.setVolume(1.0);

  queue.player.play(resource);
  queue.connection.subscribe(queue.player);
  queue.playing = true;
}

function getQueue(guildId) {
  return queues.get(guildId);
}

module.exports = {
  queues,
  createGuildQueue,
  playNext,
  getQueue,
};
