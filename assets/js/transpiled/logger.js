var Logger;
(function (Logger) {
    var $log = null;
    function init() {
        $log = document.getElementById('logger');
    }
    Logger.init = init;
    function log(string) {
        console.log(string);
        $log.innerHTML += '\n⇒ ' + string;
    }
    Logger.log = log;
})(Logger || (Logger = {}));
//# sourceMappingURL=logger.js.map