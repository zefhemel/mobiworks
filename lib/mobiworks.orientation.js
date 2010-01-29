var mobiworks = window.mobiworks || {};

mobiworks.orientation = observable.observable();

window.onresize = function () {
    // works on both Android and iPhone
    if (window.innerHeight > window.innerWidth) {
        mobiworks.orientation.fire('portrait');
    } else {
        mobiworks.orientation.fire('landscape');
    }
    setTimeout(scrollTo, 0, 0, 1);
}