/**
 * Created by manager on 2016-07-15.
 */

module.exports = class JstreeNode {
    constructor(id, text, type, state, data, children) {
        this.id = id;
        this.text = text;
        if( type )
            this.type = type;
        if( data )
            this.data = data;
        if( state )
            this.state = state;
        if( children)
            this.children = children;
    }
};

new this.JstreeNode()