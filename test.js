/**
 * Created by manager on 2016-07-15.
 */
exports.createJstreeNode = function createJstreeNode(bool) {
    console.log('createJstreeNode');
    if( bool )
        exports.createJstreeNode2(false);
};

exports.createJstreeNode2 = function createJstreeNode2(bool) {
    console.log('createJstreeNode2');
    if( bool )
        createJstreeNode(false);
};

this.createJstreeNode(true);