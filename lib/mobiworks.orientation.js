var mobiworks = window.mobiworks || {};

mobiworks.orientation = observable.observable();

window.onresize = function () {
    // works on both Android and iPhone
    if (window.innerHeight > window.innerWidth) {
        if(!window.orientation || window.orientation != 'portrait') {
            window.orientation = 'portrait';
            mobiworks.orientation.fire('portrait');
        }
    } else {
        if(!window.orientation || window.orientation != 'landscape') {
            window.orientation = 'landscape';
            mobiworks.orientation.fire('landscape');
        }
    }
    //setTimeout(scrollTo, 0, 0, 1);
}