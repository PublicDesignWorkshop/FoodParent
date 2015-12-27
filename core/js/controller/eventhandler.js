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
        VIEW_STATUS[VIEW_STATUS["MANAGE_TREES"] = 2] = "MANAGE_TREES";
        VIEW_STATUS[VIEW_STATUS["PARENT_TREES"] = 3] = "PARENT_TREES";
        VIEW_STATUS[VIEW_STATUS["GEO_ERROR"] = 4] = "GEO_ERROR";
    })(FoodParent.VIEW_STATUS || (FoodParent.VIEW_STATUS = {}));
    var VIEW_STATUS = FoodParent.VIEW_STATUS;
    (function (VIEW_MODE) {
        VIEW_MODE[VIEW_MODE["NONE"] = 0] = "NONE";
        VIEW_MODE[VIEW_MODE["MAP"] = 1] = "MAP";
        VIEW_MODE[VIEW_MODE["GRAPHIC"] = 2] = "GRAPHIC";
        VIEW_MODE[VIEW_MODE["TABLE"] = 3] = "TABLE";
    })(FoodParent.VIEW_MODE || (FoodParent.VIEW_MODE = {}));
    var VIEW_MODE = FoodParent.VIEW_MODE;
    (function (ERROR_MODE) {
        ERROR_MODE[ERROR_MODE["NONE"] = 0] = "NONE";
        ERROR_MODE[ERROR_MODE["GEO_PERMISSION_ERROR"] = 1] = "GEO_PERMISSION_ERROR";
        ERROR_MODE[ERROR_MODE["SEVER_CONNECTION_ERROR"] = 2] = "SEVER_CONNECTION_ERROR";
    })(FoodParent.ERROR_MODE || (FoodParent.ERROR_MODE = {}));
    var ERROR_MODE = FoodParent.ERROR_MODE;
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
        EventHandler.handleNavigate = function (viewStatus, option) {
            FoodParent.Controller.abortAllXHR();
            Pace.restart();
            new FoodParent.RemoveAlertViewCommand().execute();
            if (FoodParent.View.getViewStatus() != viewStatus) {
                new FoodParent.RemoveChildViewCommand({ parent: FoodParent.View }).execute();
            }
            new FoodParent.RenderNavViewCommand({ el: FoodParent.Setting.getNavWrapperElement(), viewStatus: viewStatus }).execute();
            if (viewStatus == VIEW_STATUS.HOME) {
                new FoodParent.MovePaceBarToTop().execute();
                new FoodParent.RenderHomeViewCommand({ el: FoodParent.Setting.getMainWrapperElement() }).execute();
            }
            else if (viewStatus == VIEW_STATUS.MANAGE_TREES) {
                new FoodParent.MovePaceBarToUnderNav().execute();
                new FoodParent.RenderManageTreesViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), viewMode: VIEW_MODE.MAP }).execute();
            }
            FoodParent.View.getNavView().setActiveNavItem(viewStatus);
            FoodParent.View.setViewStatus(viewStatus);
        };
        EventHandler.handleMouseClick = function (el, view) {
            switch (FoodParent.View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees' }).execute();
                    }
                    else if (el.hasClass('home-menu-right')) {
                        new FoodParent.NavigateCommand({ hash: 'ptrees' }).execute();
                    }
                    break;
                case VIEW_STATUS.GEO_ERROR:
                    if (el.hasClass('alert-confirm')) {
                        new FoodParent.RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
            }
        };
        EventHandler.handleMouseEnter = function (el, view) {
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
        };
        EventHandler.handleError = function (errorMode) {
            new FoodParent.RenderAlertViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), errorMode: errorMode }).execute();
        };
        EventHandler._instance = new EventHandler();
        EventHandler.TAG = "Controller - ";
        return EventHandler;
    })();
    FoodParent.EventHandler = EventHandler;
})(FoodParent || (FoodParent = {}));
