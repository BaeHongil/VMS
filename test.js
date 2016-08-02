/**
 * Created by manager on 2016-07-15.
 */

var arr = [1,2,3,4,5];

function aaa() {
    this.init();
}
aaa.prototype = {
    init : function () {
        console.log('init');
    }
};
new aaa();