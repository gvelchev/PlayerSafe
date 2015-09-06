
define(function () {

    return {
        KEY_SPACE: 32, // key code of space (action: play/pause)
        KEY_RIGHT_ARROW: 39, // key code of right arrow (action: forward 10 seconds)
        
        init: function () {
            this.findPlayer();
        },
        /**
         * Find out status of netflix player on the page.
         * 
         * @returns {undefined}
         */
        findPlayer: function() {
            var counter = 0,
            func = setInterval(function () {
                if (document.getElementsByClassName('player-status').length > 0) {
                    this.addSkipControl();
                    this.bindEvents();
                    clearInterval(func);
                }

                if (counter > 100) {
                    clearInterval(func);
                }

                counter++;
            }.bind(this), 500);
        },
        /**
         * Bind nessary events to append some elemets in netflix player
         * after video was changed.
         * 
         * @returns {undefined}
         */
        bindEvents: function() {
                var episodeList = document.getElementsByClassName('episode-list')[0];
                if (episodeList) {
                    var i = episodeList.children.length;
                    for( ; i--; ) {
                        episodeList.children[i].addEventListener('click', function(){
                            this.init();
                        }.bind(this), false);
                    }
                }

                var nextEpisodeBtn = document.getElementsByClassName('player-control-button player-next-episode icon-player-next-episode')[0];
                if (nextEpisodeBtn) {
                    nextEpisodeBtn.addEventListener('click', function(){
                        this.init();
                    }.bind(this), false);
                }
        },
        /**
         * Integration into netflix player the container for ability to enter a time
         * to go in the video (hours and minutes)
         * 
         * @returns {undefined}
         */
        addSkipControl: function () {
            var player = document.getElementsByClassName('player-status')[0];

            if(!player) {
                throw new Error('Can\'t found element');
            }
            
            if(!document.getElementById('playbackSkipTime')) {
                var container = document.createElement('DIV');
                container.style.float = 'right';

                var skipInput = document.createElement('INPUT');
                skipInput.id = 'playbackSkipTime';
                skipInput.type = 'text';
                skipInput.style.cssText = "width: 50px; height: 24px; font-size: medium; color: #000000; text-align: center";

                var skipButton = document.createElement('INPUT');
                skipButton.type = 'button';
                skipButton.value = 'Go';
                skipButton.onclick = this.skipAction.bind(this);
                skipButton.style.cssText = "width: 50px; height: 24px; font-size: medium; color: #4c4c4c";
                //skipButton.className += skipButton.className ? ' player-control-button' : 'player-control-button';

                container.appendChild(skipInput);
                container.appendChild(skipButton);

                player.appendChild(container);
            }
        },
        /**
         * The possibility go to the video at the specified timestamp.
         * 
         * @returns {undefined}
         */
        skipAction: function () {
            var skipInputContent = document.getElementById('playbackSkipTime').value,
                seconds = 0,
                time = null;

            time = /(\d{1,2}):?(\d{1,2})?/.exec(skipInputContent);
            if (time) {
                time.shift();
                time = time.filter(function (item) {
                    return item;
                });

                seconds = this.converToSeconds(time);

                if (seconds > 0) {
                    while(seconds >= 10) {
                         seconds -= 10;
                        this.controlPlayer(this.KEY_RIGHT_ARROW);
                    }
                    this.controlPlayer(this.KEY_SPACE);
                }
            }
        },
        /**
         * Convert given time to seconds.
         * 
         * @param {Array} time
         * @returns {Number}
         */
        converToSeconds: function (time) {
            var seconds = 0;

            switch (time.length) {
                case 1:
                    if(parseInt(time[0]) > 60) {
                        break;
                    }
                    // minutes to seconds
                    seconds = parseInt(time[0]) * 60;
                    break;
                case 2:
                    if(parseInt(time[0]) > 3 || parseInt(time[1]) > 60) {
                        break;
                    }
                    // hours and minutes to seconds
                    seconds = parseInt(time[0]) * 60 * 60;
                    seconds += parseInt(time[1]) * 60;
                    break;
            }

            return seconds;
        },
        /**
         * Simulate pressing key
         * 
         * @param {Number} keyCode
         * @returns {undefined}
         */
        controlPlayer: function (keyCode) {
            // Prepare function for injection into page
            function injected(keyCode) {
                // Adjust as needed; some events are only processed at certain elements
                var element = document.body;

                function keyEvent(el, ev) {
                    var eventObj = document.createEvent("Events");
                    eventObj.initEvent(ev, true, true);

                    eventObj.keyCode = keyCode;
                    eventObj.which = keyCode;

                    el.dispatchEvent(eventObj);
                }

                // Trigger all 3 just in case
                keyEvent(element, "keydown");
                keyEvent(element, "keypress");
                keyEvent(element, "keyup");
            }

            // Inject the script
            var script = document.createElement('script');
            script.textContent = "(" + injected.toString() + ")(" + keyCode +");";
            (document.head || document.documentElement).appendChild(script);
            script.parentNode.removeChild(script);
        },
    }.init();

});