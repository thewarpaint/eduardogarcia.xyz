var Logger = /** @class */ (function () {
    function Logger() {
        this.$log = null;
    }
    Logger.prototype.init = function () {
        this.$log = document.getElementById('logger');
    };
    Logger.prototype.log = function (string) {
        console.log(string);
        this.$log.innerHTML += '\n⇒ ' + string;
    };
    return Logger;
}());
//# sourceMappingURL=logger.js.map