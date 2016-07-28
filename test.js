/**
 * Created by manager on 2016-07-15.
 */

var arr = [1,2,3,4,5];

arr.some( function (v, i) {
    console.log(v);
    return false;
});