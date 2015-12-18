var FoodParent;
(function (FoodParent) {
    (function (ACTION_STATUS) {
        ACTION_STATUS[ACTION_STATUS["NONE"] = 0] = "NONE";
        ACTION_STATUS[ACTION_STATUS["IDLE"] = 1] = "IDLE";
        ACTION_STATUS[ACTION_STATUS["LOADING"] = 2] = "LOADING";
        ACTION_STATUS[ACTION_STATUS["LOADED"] = 3] = "LOADED";
        ACTION_STATUS[ACTION_STATUS["ERROR"] = 4] = "ERROR";
    })(FoodParent.ACTION_STATUS || (FoodParent.ACTION_STATUS = {}));
    var ACTION_STATUS = FoodParent.ACTION_STATUS;
    (function (VIEW_STATUS) {
        VIEW_STATUS[VIEW_STATUS["NONE"] = 0] = "NONE";
        VIEW_STATUS[VIEW_STATUS["HOME"] = 1] = "HOME";
    })(FoodParent.VIEW_STATUS || (FoodParent.VIEW_STATUS = {}));
    var VIEW_STATUS = FoodParent.VIEW_STATUS;
    var EventHandler = (function () {
        function EventHandler(args) {
            this.bDebug = true;
            if (EventHandler._instance) {
                throw new Error("Error: Instantiation failed: Use EventHandler.getInstance() instead of new.");
            }
            EventHandler._instance = this;
        }
        EventHandler.getInstance = function () {
            return EventHandler._instance;
        };
        EventHandler.handleClick = function () {
            return null;
        };
        EventHandler.handleNavigate = function (viewStatus, option) {
            if (FoodParent.View.getViewStatus() == VIEW_STATUS.NONE) {
            }
            new FoodParent.CreateNavViewCommand({ el: FoodParent.Setting.getNavWrapperElement() }).execute();
            new FoodParent.CreateHomeViewCommand({ el: FoodParent.Setting.getMainWrapperElement() }).execute();
            FoodParent.View.setViewStatus(viewStatus);
            return null;
        };
        EventHandler.handleMouseOver = function (el, view) {
            switch (FoodParent.View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new FoodParent.FocusMenuLeftCommand().execute();
                    }
                    else if (el.hasClass('home-menu-right')) {
                        new FoodParent.FocusMenuRightCommand().execute();
                    }
                    break;
            }
            return null;
        };
        EventHandler._instance = new EventHandler();
        EventHandler.TAG = "Controller - ";
        return EventHandler;
    })();
    FoodParent.EventHandler = EventHandler;
})(FoodParent || (FoodParent = {}));
