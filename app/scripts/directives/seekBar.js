(function () {
    function seekBar($document) {
        var calculatePercent = function (seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };
        
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {
                scope.setAt = 0;
                scope.max = 100;
                
                var seekBar = $(element);
                
                attributes.$observe('setAt', function(newValue) {
                    scope.setAt = newValue;
                });
                
                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });
                
                var percentString = function() {
                    var curValue = scope.setAt;
                    var max = scope.max;
                    var percent = curValue / max * 100;
                    return percent + "%";
                };
                
                scope.fillStyle = function() {
                    return {width: percentString()};
                };

                scope.thumbStyle = function() {
                    return {left: percentString()};
                };

                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.setAt = percent * scope.max;
                    notifyOnChange(scope.setAt);
                };
                
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function(event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.setAt = percent * scope.max;
                            notifyOnChange(scope.setAt);
                        });
                    });
                    
                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
                
                var notifyOnChange = function notifyOnChange(nextValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({value: nextValue});
                    }
                };
                
            }
        };    
    }
    
    angular
        .module('blocJams')
        .directive('seekBar', ['$document',  seekBar]);
})();
