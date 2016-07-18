/**
 * Created by manager on 2016-07-15.
 */
var normalizedPath = require("path").join(__dirname, "routes");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
    require("./routes/" + file);
});

n