(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        /**
        * @desc active album object
        * @type {object}
        */
        var currentAlbum = Fixtures.getAlbum();

        /**
        * @desc Buzz object audio file
        * @type {object}
        */
        var currentBuzzObject = null;
        
        /**
        * @function setSong
        * @desc stops currently playing song and loads new audio file as currentBuzzObject
        * @param {object} song
        */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            

            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            currentBuzzObject.bind('ended', function() {
                $rootScope.$apply(function() {
                    SongPlayer.next();
                });
            });

            
            SongPlayer.currentSong = song;
            
        };

        /**
        * @function playSong
        * @desc plays current song and sets public attribute to true
        * @param {object} song
        */
        var playSong = function(song) {
           currentBuzzObject.play();
           song.playing = true; 
        };

        /**
        * @function stopSong
        * @desc stops active song and sets public attribute to false
        * @param {object} song
        */
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        };

        /**
        * @function getSongIndex
        * @desc get index of active song
        * @param {object} song
        */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        
        /**
        * @desc Active song object from list of songs 
        * @type {object}
        */
        SongPlayer.currentSong = null;
        
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;

        /**
        * @desc current volume of active sone
        * @type {Number}
        */
        SongPlayer.volume = null;
        
        /**
        * @function public function SongPlayer.play
        * @desc depending on song selected, it stops currently playing song and loads new audio file as currentBuzzObject, if necessary and plays current song and sets public attribute to true
        * @param {object} song
        */
        SongPlayer.play = function play(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song && currentBuzzObject !== null) {
                if (currentBuzzObject.isPaused() ) {
                    playSong(song);
                }
            }
        };
        
        /**
        * @function public function SongPlayer.pause
        * @desc pauses current song and sets public attribute to false
        * @param {object} song
        */
        SongPlayer.pause = function pause(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function public function SongPlayer.previous
        * @desc get the index of the song before the active song and set that to active song and play it
        * @param {object} song
        */
        SongPlayer.previous = function previous() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                //stopSong(SongPlayer.currentSong);
                currentSongIndex = (currentAlbum.songs.length - 1)
            } 
            
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
            
        };

                /**
        * @function public function SongPlayer.next
        * @desc get the index of the song afater the active song and set that to active song and play it
        * @param {object} song
        */
        SongPlayer.next = function next() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
           /* currentSongIndex = 0;
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            */
            
            if (currentSongIndex == currentAlbum.songs.length) {
                //stopSong(SongPlayer.currentSong);
                currentSongIndex = 0;
                } 
             
            var song = currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
            
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function (time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
         /**
        * @function setVolume
        * @desc Set volume of currently playing song
        * @param {Number} time
        */
        SongPlayer.setVolume = function (volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume);
            }
        };

        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();
