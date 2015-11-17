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
            return "FoodParent&#153;";
        };
        Localization.prototype.getTreesText = function () {
            return "Trees";
        };
        Localization.prototype.getPeopleText = function () {
            return "People";
        };
        Localization.prototype.getNoteText = function () {
            return "Note";
        };
        Localization.prototype.getAboutText = function () {
            return "About";
        };
        Localization.prototype.getFlagText = function () {
            return "Flag";
        };
        Localization.prototype.getOwnershipText = function () {
            return "Ownership";
        };
        Localization.prototype.getRecentText = function () {
            return "Recent Activities";
        };
        Localization.prototype.getRipeningText = function () {
            return "Ripnening";
        };
        Localization.prototype.getTreeListText = function () {
            return "Tree List";
        };
        Localization.prototype.getPeopleListText = function () {
            return "People List";
        };
        Localization.prototype.getDeleteConfirmText = function () {
            return "Are you sure to delete this item?";
        };
        Localization.prototype.getNoDataText = function () {
            return "No Data";
        };
        Localization.prototype.getNoteDetailText = function () {
            return "Note Detail";
        };
        Localization.prototype.getAddNoteText = function () {
            return "Add Note";
        };
        Localization.prototype.getDeleteNoteText = function () {
            return "Delete Note";
        };
        Localization._instance = new Localization();
        return Localization;
    })();
    FoodParent.Localization = Localization;
})(FoodParent || (FoodParent = {}));
