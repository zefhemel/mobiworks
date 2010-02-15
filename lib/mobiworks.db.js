var mobiworks = window.mobiworks || {};

(function() {
    function DataView(queryCollection) {
        this.queryCollection = queryCollection;
    }
    
    Dataview.prototype = observable.observable();
    
    DataView.prototype.setSource = function(queryCollection) {
        this.queryCollection = queryCollection;
    };
    
    mobiworks.DataView = DataView;
}());