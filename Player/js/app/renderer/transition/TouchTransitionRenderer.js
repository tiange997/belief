/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
    klynt.TouchTransitionRenderer = function (model) {
        this._automatic = false;
        klynt.TransitionRenderer.call(this, model);
        this._animation = this._getAnimationDescription();
    };

    klynt.TouchTransitionRenderer.prototype = {
        _animation: null,
        get animation() {
            return this._animation;
        },

        get direction() {
            return this._model.direction;
        }
    };

    klynt.TouchTransitionRenderer.prototype.execute = function (source, target) {
        klynt.TransitionRenderer.prototype.execute.call(this, source, target);

        if (source) {
            source.$element
                .stop()
                .css(this.animation.source.from);
        }

        target.$element
            .stop()
            .css(this.animation.target.from);
    };

    klynt.TouchTransitionRenderer.prototype.dragendOffset = function (deltaX, deltaY) {
        var progress = this._getProgress(deltaX, deltaY);
        // return;

        if (this.source) {
            this.source.$element.css({
                top: this.animation.source.from.top + progress.y * this.animation.source.delta.top,
                left: this.animation.source.from.left + progress.x * this.animation.source.delta.left
            });
        }

        if (this.target) {
            this.target.$element.css({
                top: this.animation.target.from.top + progress.y * this.animation.target.delta.top,
                left: this.animation.target.from.left + progress.x * this.animation.target.delta.left
            })
        }
    };

    klynt.TouchTransitionRenderer.prototype.dragend = function (deltaX, deltaY) {
        var progress = this._getProgress(deltaX, deltaY);
        progress = progress.x + progress.y;
        var validateTransition = progress > 0.5;

        if (validateTransition) {
            $(this).trigger('validate.animation', this);

            if (this.source) {
                this.source._end();
                klynt.animation.to({duration: this.duration * (1 - progress) / 1000, properties: this.animation.source.to}, this.source.$element);
            }

            this.animation.target.to.onComplete = this._notifyComplete.bind(this);
            klynt.animation.to({duration: this.duration * (1 - progress) / 1000, properties: this.animation.target.to}, this.target.$element);
        } else {
            if (this.source) {
                this.source.play();
                klynt.animation.to({duration: this.duration * progress / 1000, properties: this.animation.source.from}, this.source.$element);
            }

            this.animation.target.from.onComplete = this._notifyCancelComplete.bind(this);
            klynt.animation.to({duration: this.duration * progress / 1000, properties: this.animation.target.from}, this.target.$element); 
        }
    };

    klynt.TouchTransitionRenderer.prototype._getProgress = function (deltaX, deltaY) {
        var progress = {
            x: 0,
            y: 0
        };

        switch (this.direction) {
        case klynt.TouchTransitionRenderer.DIRECTION.UP:
            progress.y = -deltaY / klynt.sequenceContainer.unscaledHeight;
            break;
        case klynt.TouchTransitionRenderer.DIRECTION.DOWN:
            progress.y = deltaY / klynt.sequenceContainer.unscaledHeight;
            break;
        case klynt.TouchTransitionRenderer.DIRECTION.LEFT:
            progress.x = -deltaX / klynt.sequenceContainer.unscaledWidth;
            break;
        case klynt.TouchTransitionRenderer.DIRECTION.RIGHT:
            progress.x = deltaX / klynt.sequenceContainer.unscaledWidth;
            break;
        }

        progress.x = Math.max(0, Math.min(progress.x, 1));
        progress.y = Math.max(0, Math.min(progress.y, 1));

        return progress;
    };

    klynt.TouchTransitionRenderer.prototype._notifyCancelComplete = function () {
        this._discarded = this.target;
        if (this.discarded) {
            this.discarded.$element.removeClass('transition-running');
        }

        this._result = this.source;
        if (this.result) {
            this.result.$element.removeClass('transition-running');
        }

        $(this).trigger('cancel.animation', this);
    };

    klynt.TouchTransitionRenderer.prototype._getAnimationDescription = function () {
        var width = klynt.sequenceContainer.$fullscreenWrapper.width();
        var height = klynt.sequenceContainer.$fullscreenWrapper.height();
        var source = {
            from: {
                left: 0,
                top: 0
            },
            to: {
                left: 0,
                top: 0
            }
        };
        var target = {
            from: {
                left: 0,
                top: 0
            },
            to: {
                left: 0,
                top: 0
            }
        };

        switch (this.direction) {
        case DIRECTION.UP:
            source.to.top = -height;
            target.from.top = height;
            break;
        case DIRECTION.DOWN:
            source.to.top = height;
            target.from.top = -height;
            break;
        case DIRECTION.LEFT:
            source.to.left = -width;
            target.from.left = width;
            break;
        case DIRECTION.RIGHT:
            source.to.left = width;
            target.from.left = -width;
        }
        source.delta = {
            top: source.to.top - source.from.top,
            left: source.to.left - source.from.left
        }
        target.delta = {
            top: target.to.top - target.from.top,
            left: target.to.left - target.from.left
        }
        return {
            source: source,
            target: target
        };
    };

    klynt.TouchTransitionRenderer.prototype = klynt.utils.mergePrototypes(klynt.TransitionRenderer, klynt.TouchTransitionRenderer);

    var DIRECTION = klynt.TouchTransitionRenderer.DIRECTION = {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right'
    }
})(window.klynt);