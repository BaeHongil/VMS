/**
 * Created by manager on 2016-08-18.
 */
// additional icon on node (outside of anchor)
(function ($, undefined) {
    "use strict";

    $.jstree.plugins.button = function (options, parent) {
        var buttons = [];

        this.add_button = function (type, className, callback) {
            var isButton = buttons.some( function (button, index) {
                if( button.type === type )
                    return true;
            });

            if( !isButton ) {
                var button = {
                    type: type,
                    className: className,
                    callback: callback
                };
                buttons.push(button);
                this.redraw(true);
            }

        };

        this.remove_button = function (type) {
            var isButton = buttons.some( function (button, index) {
                if( button.type === type ) {
                    buttons.splice(index, 1);
                    return true;
                }
            });
            if( isButton )
                this.redraw(true);
        };

        this.redraw_node = function(obj, deep, callback) {
            var node = this.get_node(obj);

            obj = parent.redraw_node.call(this, obj, deep, callback);
            buttons.forEach( function (button) {
                if( node.type === button.type ) {
                    if(obj) {
                        var anchor = document.createElement('a');
                        anchor.href = '#';
                        anchor.className = button.className;
                        anchor.onclick = function () {
                            button.callback(node);
                            return false;
                        };
                        obj.insertBefore(anchor, obj.childNodes[2]);
                    }
                }
            });

            return obj;
        };
    };
})(jQuery);

