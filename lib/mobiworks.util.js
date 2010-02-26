var mobiworks = window.mobiworks || {};

function ref(e, property) {
    return new mobiworks.Reference(e, property);
}

function fromScope(that, prop) {
    if(prop) {
        return $(that).scope().get(prop);
    } else {
        return $(that).scope();
    }
}

(function () {
    function LinkedMap (parent, values) {
        this.values = values || {};
        this.parent = parent;
    }

    LinkedMap.prototype.get = function (key) {
        if (key in this.values) {
            return this.values[key];
        } else if (this.parent) {
            return this.parent.get(key);
        } else {
            return undefined;
        }
    };

    LinkedMap.prototype.set = function (key, value) {
        var current = this;
        while (!(key in current.values) && current.parent) {
            current = current.parent;
        }
        if (key in current.values) {
            current.values[key] = value;
        } else {
            this.values[key] = value;
        }
    };

    LinkedMap.prototype.setLocal = function (key, value) {
        this.values[key] = value;
    };
    
    /**
     * Represents a reference to a property
     * 
     * @param e
     *            object to reference
     * @param prop
     *            property to reference, if null/undefined this reference
     *            represents a reference to a decoupled values
     * @constructor
     */
    function Reference(e, prop) {
        this.e = e;
        this.prop = prop;
    }
    
    Reference.prototype.get = function() {
        if(!this.prop) {
            return this.e;
        }
        if(this.e.get) {
            return this.e.get(this.prop);
        } else {
            return this.e[this.prop];
        }
    };
    
    Reference.prototype.set = function(value) {
        if(!this.prop) {
            this.e = value;
        }
        if(this.e.set) {
            return this.e.set(this.prop, value);
        } else {
            this.e[this.prop] = value;
        }
    };

    mobiworks.LinkedMap = LinkedMap;
    mobiworks.Reference = Reference;
}());