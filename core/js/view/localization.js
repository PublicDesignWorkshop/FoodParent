var FoodParent;
(function (FoodParent) {
    var Localization = (function () {
        function Localization(args) {
            if (Localization._instance) {
                throw new Error("Error: Instantiation failed: Use Localization.getInstance() instead of new.");
            }
            Localization._instance = this;
        }
        Localization.getInstance = function () {
            return Localization._instance;
        };
        Localization.prototype.getSiteText = function () {
            return "FoodParent";
        };
        Localization.prototype.getTreesText = function () {
            return "Trees";
        };
        Localization.prototype.getNoteText = function () {
            return "Note";
        };
        Localization.prototype.getAboutText = function () {
            return "About";
        };
        Localization._instance = new Localization();
        return Localization;
    })();
    FoodParent.Localization = Localization;
})(FoodParent || (FoodParent = {}));
//# sourceMappingURL=localization.js.map