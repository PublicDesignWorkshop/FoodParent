var FoodParent;
(function (FoodParent) {
    var Command = (function () {
        function Command() {
        }
        Command.prototype.execute = function () {
        };
        Command.prototype.undo = function () {
        };
        return Command;
    })();
    FoodParent.Command = Command;
    var CreateHomeViewCommand = (function () {
        function CreateHomeViewCommand(args) {
            var self = this;
            self._el = args.el;
        }
        CreateHomeViewCommand.prototype.execute = function () {
            var self = this;
            FoodParent.View.addChild(FoodParent.HomeViewFractory.create(self._el).render());
        };
        CreateHomeViewCommand.prototype.undo = function () {
        };
        return CreateHomeViewCommand;
    })();
    FoodParent.CreateHomeViewCommand = CreateHomeViewCommand;
    var CreateNavViewCommand = (function () {
        function CreateNavViewCommand(args) {
            var self = this;
            self._el = args.el;
        }
        CreateNavViewCommand.prototype.execute = function () {
            var self = this;
            FoodParent.View.setNavView(FoodParent.NavViewFractory.create(self._el).render());
        };
        CreateNavViewCommand.prototype.undo = function () {
        };
        return CreateNavViewCommand;
    })();
    FoodParent.CreateNavViewCommand = CreateNavViewCommand;
    var FocusMenuLeftCommand = (function () {
        function FocusMenuLeftCommand() {
        }
        FocusMenuLeftCommand.prototype.execute = function () {
            var self = this;
            FoodParent.View.getNavView().focusOnLeft();
        };
        FocusMenuLeftCommand.prototype.undo = function () {
        };
        return FocusMenuLeftCommand;
    })();
    FoodParent.FocusMenuLeftCommand = FocusMenuLeftCommand;
    var FocusMenuRightCommand = (function () {
        function FocusMenuRightCommand() {
        }
        FocusMenuRightCommand.prototype.execute = function () {
            var self = this;
            FoodParent.View.getNavView().focusOnRight();
        };
        FocusMenuRightCommand.prototype.undo = function () {
        };
        return FocusMenuRightCommand;
    })();
    FoodParent.FocusMenuRightCommand = FocusMenuRightCommand;
})(FoodParent || (FoodParent = {}));
