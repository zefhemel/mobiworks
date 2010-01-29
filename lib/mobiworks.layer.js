
jQuery.fn.initLayers = function() {
    var layerDecls = this.find("span.layers");
    for(var i = 0; i < layerDecls.length; i++) {
        var layerDecl = layerDecls.eq(i);
        var layerOptions = layerDecl.children();
        var options = {};
        for(var j = 0; j < layerOptions.length; j++) {
            var option = layerOptions.eq(j);
            options[option.attr('id')] = option.contents();
        }
        layerDecl.data("options", options);
        var defaultOption = layerOptions.eq(0).contents();
        layerDecl.empty();
        layerDecl.append(defaultOption);
    }
}