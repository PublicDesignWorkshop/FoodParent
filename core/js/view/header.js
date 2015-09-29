var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FruitParent;
(function (FruitParent) {
    var Header = (function (_super) {
        __extends(Header, _super);
        //private bGeoLocationAvailable: boolean;
        function Header(options) {
            _super.call(this, options);
        }
        Header.prototype.render = function () {
            var that = this;
        };
        return Header;
    })(Backbone.View);
    FruitParent.Header = Header;
})(FruitParent || (FruitParent = {}));
//# sourceMappingURL=header.js.map