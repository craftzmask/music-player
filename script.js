const playIconSrc = 'assets/Play_fill.svg';
const pauseIconSrc = 'assets/Pause_fill.svg';

const songList = [
  {
    name: "Lost in the City Lights",
    artist: "Cosmo Sheldrake",
    audio: new Audio('./assets/lost-in-city-lights.mp3'),
    albumImage: './assets/cover-1.png'
  },
  {
    name: "Forest Lullaby",
    artist: "Brandon Fiechter",
    audio: new Audio('./assets/forest-lullaby.mp3'),
    albumImage: './assets/cover-2.png'
  }
];

const albumImageElement = document.querySelector('.album img');
const songNameElement = document.querySelector('.name-song');
const artistNameElement = document.querySelector('.name-artist');
const currentTimeElement = document.querySelector('.time-duration__current-time');
const songTimeElement = document.querySelector('.time-duration__song-time');
const processBarElement = document.querySelector('.bar-container__progress-bar');
const processBarContainerElement = document.querySelector('.music-duration__bar-container');
const playButtonElement = document.querySelector('.play-button');
const previousButtonElement = document.querySelector('.previous-button');
const nextButtonElement = document.querySelector('.next-button');

let currentSongIndex = 0;
let isPlaying = false;

songList.forEach(song => song.audio.addEventListener('timeupdate', updateProcessBar));

// Audio cannot be play until loadedmetadata updated
songList[currentSongIndex].audio.addEventListener('loadedmetadata', () => {
  updateUI(songList[currentSongIndex]);
})

playButtonElement.addEventListener('click', playCurrentSong);

previousButtonElement.addEventListener('click', () => {
  resetCurrentSong();
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songList.length - 1;
  }
  updateUI(songList[currentSongIndex]);
  playCurrentSong();
});

nextButtonElement.addEventListener('click', () => {
  resetCurrentSong();
  currentSongIndex++;
  if (currentSongIndex >= songList.length) {
    currentSongIndex = 0;
  }
  updateUI(songList[currentSongIndex]);
  playCurrentSong();
});

processBarContainerElement.addEventListener('click', adjustPlayTime);

function adjustPlayTime(event) {
  const song = songList[currentSongIndex].audio;
  const boundingClient = processBarElement.getBoundingClientRect();
  const clickX = event.clientX - boundingClient.left;
  const maxWidth = processBarContainerElement.offsetWidth;
  const newPosition = (clickX / maxWidth) * song.duration;
  song.currentTime = newPosition;
}

function updateUI(song) {
  albumImageElement.src = song.albumImage;
  songNameElement.textContent = song.name;
  artistNameElement.textContent = song.artist;
  songTimeElement.textContent = durationFormat(song.audio.duration);
  const icon = playButtonElement.children[0];
  isPlaying ? icon.src = pauseIconSrc : icon.src = playIconSrc
}

function durationFormat(duration) {
  let minutes = parseInt(duration / 60);
  let seconds = parseInt(duration - minutes * 60);
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;
  return `${minutes}:${seconds}`;
}

function updateProcessBar() {
  const audio = songList[currentSongIndex].audio;
  const currentTime = audio.currentTime;
  const songDuration = audio.duration;
  const fullProcess = processBarElement.parentElement.offsetWidth;
  let currentProcess = (currentTime * fullProcess) / songDuration;
  processBarElement.style.width = `${parseInt(currentProcess)}px`;
  currentTimeElement.textContent = durationFormat(currentTime);
}

function resetCurrentSong() {
  isPlaying = false;
  songList[currentSongIndex].audio.currentTime = 0;
  songList[currentSongIndex].audio.pause();
}

function playCurrentSong() {
  const song = songList[currentSongIndex];
  !isPlaying ? song.audio.play() : song.audio.pause();
  isPlaying = !isPlaying;
  updateUI(song);
}