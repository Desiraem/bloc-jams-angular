(function() {
    function SongPlayer() {
        var SongPlayer = {};
        /**
        * @desc private attribute to hold current Song object 
        * @type {object}
        */
        var currentSong = null;

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
                currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentSong = song;
            
        };

        /**
        * @function playSong
        * @desc current song and sets public attribute to true
        * @param {object} song
        */
        var playSong = function(song) {
           currentBuzzObject.play();
           song.playing = true; 
        };
        
        /**
        * @function public function SongPlayer.play
        * @desc depending on song selected, it stops currently playing song and loads new audio file as currentBuzzObject, if necessary and plays current song and sets public attribute to true
        * @param {object} song
        */
        SongPlayer.play = function(song) {
            if (currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    playSong(song);
                }
            }
        };
        
        /**
        * @function public function SongPlayer.pause
        * @desc pauses current song and sets public attribute to false
        * @param {object} song
        */
        SongPlayer.pause = function(song) {
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', SongPlayer);
})();
