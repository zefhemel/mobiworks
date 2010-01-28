var mobiworks = window.mobiworks || {};

mobiworks.orientation = observable.observable();

window.onorientationchange = function () {
    var orientation = window.orientation;
    switch (orientation) {
    case 0:
        mobiworks.orientation.fire('portrait');
        break;
    case 90:
        mobiworks.orientation.fire('landscapeLeft');
        break;

    case -90:
        mobiworks.orientation.fire('landscapeRight');
        break;
    }
}