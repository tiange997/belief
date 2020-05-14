/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 *
 * This file contains the implementation of the player main module.
 * */

(function (klynt) {
    var minimumMouseWheelDelta = 1;
    var panTransition = null;
    var hammer = null;
    var lastOpenTime = undefined;

    var accessors = {
        get keyboardNavigationEnabled() {
            return klynt.data.advanced && klynt.data.advanced.enableKeyboardNavigation;
        },

        get scrollNavigationEnabled() {
            return klynt.data.advanced && klynt.data.advanced.enableScrollNavigation;
        },

        get swipeNavigationEnabled() {
            return klynt.data.advanced && klynt.data.advanced.enableSwipeNavigation;
        },

        get panNavigationEnabled() {
            return klynt.data.advanced && klynt.data.advanced.enablePanNavigation;
        }
    };

    klynt.getModule('events', accessors).expose(init, move);

    function init() {
        $(document).keydown(function(event) {
            if (event.keyCode == 32) {
                klynt.player.togglePlayPause();
            } else if (klynt.events.keyboardNavigationEnabled) {
                var direction = getDirectionFromKeyCode(event.keyCode);
                if (direction) {
                    move(direction, 'keyboard');
                }
            }
        });

        if (this.scrollNavigationEnabled) {
            $(document).mousewheel(function(event) {
                var delta = event.deltaY;
                if (Math.abs(delta) >= minimumMouseWheelDelta) {
                    move(delta < 0 ? 'up' : 'down', 'scroll');
                }
            });
        }

        if (this.swipeNavigationEnabled) {
            hammer = hammer || new Hammer(klynt.sequenceContainer.$element[0]);

            hammer.get('swipe').set({
                direction: Hammer.DIRECTION_ALL,
                velocity: 0.1
            });
            hammer.on("swipe", function (event) {
                event.preventDefault();

                var direction = getDirectionGesture(event.direction);
                if (direction) {
                    move(direction, 'swipe');
                }
            });
        }

        if (this.panNavigationEnabled) {
            hammer = hammer || new Hammer(klynt.sequenceContainer.$element[0]);

            hammer.get('pan').set({
                direction: Hammer.DIRECTION_ALL
            });
            hammer.on("pan panend pancancel", function (event) {
                event.preventDefault();

                if (event.type == "pan") {
                    if (!panTransition && !klynt.sequenceManager.openingSequence) {
                        panTransition = klynt.sequenceManager.openSequenceWithTouch(getDirectionGesture(event.direction));
                    }
                    panTransition && panTransition.dragendOffset(event.deltaX * 2, event.deltaY * 2);
                } else {
                    panTransition && panTransition.dragend(event.deltaX * 2, event.deltaY * 2, Math.abs(event.velocity));
                    panTransition = null;
                }
            });
        }
    }

    function move(direction, moveType, closeMenu) {
        if (klynt.sequenceManager.openingSequence || (!closeMenu && klynt.menu.isOpen)) {
            return;
        }

        var currentTime = Date.now() / 1000;
        if (klynt.events.lastOpenTime !== undefined && klynt.events.lastOpenTime + 2 > currentTime) {
            return;
        }

        var selectedLink = findLinkInDirection(direction);
        if (selectedLink) {
            klynt.events.lastOpenTime = currentTime;
            klynt.player.open(selectedLink);
        }
    }

    function getDirectionFromKeyCode(keyCode) {
        switch (keyCode) {
        case 37:
            return 'right';
        case 38:
            return 'down';
        case 39:
            return 'left';
        case 40:
            return 'up';
        default:
            return null;
        }
    }

    function getDirectionGesture(direction) {
        switch (direction) {
        case 2:
            return 'left';
        case 4:
            return 'right';
        case 8:
            return 'up';
        case 16:
            return 'down';
        default:
            return null;
        }
    }

    function findLinkInDirection(direction) {
        var elements = findArrowsWithDirection(direction);
        var selectedLink = elements.length === 1 ? elements[0].link : null;

        return selectedLink && selectedLink.target && !selectedLink.overlay ? selectedLink : null;
    }

    function findArrowsWithDirection(arrowDirection) {
        var currentSequenceTime = klynt.sequenceContainer.currentRenderer.currentTime;

        return klynt.sequenceContainer.currentSequence.elements.filter(function (element) {
            if (!element.link || !element.link.transition || element.link.automaticTransition) {
                return false;
            }
            if (element.link.transition.type && element.link.transition.type.toLowerCase().indexOf(arrowDirection) == -1) {
                return false;
            }

            if (element.begin > currentSequenceTime || element.end < currentSequenceTime) {
                //return false;
            }

            return true;
        });
    }
})(window.klynt);