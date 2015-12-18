var FoodParent;
(function (FoodParent) {
    var Command = (function () {
        function Command(args) {
        }
        Command.prototype.execute = function (args) {
        };
        Command.prototype.undo = function () {
        };
        return Command;
    })();
    FoodParent.Command = Command;
    var ViewCommand = (function () {
        function ViewCommand(args) {
        }
        ViewCommand.prototype.execute = function (el) {
        };
        ViewCommand.prototype.undo = function () {
        };
        return ViewCommand;
    })();
    FoodParent.ViewCommand = ViewCommand;
})(FoodParent || (FoodParent = {}));
