var FoodParent;
(function (FoodParent) {
    /*
    export enum ACTION_STATUS {
        NONE, IDLE, LOADING, LOADED, ERROR
    }
    */
    (function (DATA_MODE) {
        DATA_MODE[DATA_MODE["NONE"] = 0] = "NONE";
        DATA_MODE[DATA_MODE["CREATE"] = 1] = "CREATE";
        DATA_MODE[DATA_MODE["DELETE"] = 2] = "DELETE";
        DATA_MODE[DATA_MODE["UPDATE_LOCATION"] = 3] = "UPDATE_LOCATION";
        DATA_MODE[DATA_MODE["UPDATE_FLAG"] = 4] = "UPDATE_FLAG";
        DATA_MODE[DATA_MODE["UPDATE_OWNERSHIP"] = 5] = "UPDATE_OWNERSHIP";
        DATA_MODE[DATA_MODE["UPDATE_FOODTYPE"] = 6] = "UPDATE_FOODTYPE";
        DATA_MODE[DATA_MODE["UPDATE_DESCRIPTION"] = 7] = "UPDATE_DESCRIPTION";
    })(FoodParent.DATA_MODE || (FoodParent.DATA_MODE = {}));
    var DATA_MODE = FoodParent.DATA_MODE;
    (function (VIEW_STATUS) {
        VIEW_STATUS[VIEW_STATUS["NONE"] = 0] = "NONE";
        VIEW_STATUS[VIEW_STATUS["HOME"] = 1] = "HOME";
        VIEW_STATUS[VIEW_STATUS["MANAGE_TREES"] = 2] = "MANAGE_TREES";
        VIEW_STATUS[VIEW_STATUS["PARENT_TREES"] = 3] = "PARENT_TREES";
        VIEW_STATUS[VIEW_STATUS["GEO_ERROR"] = 4] = "GEO_ERROR";
        VIEW_STATUS[VIEW_STATUS["NETWORK_ERROR"] = 5] = "NETWORK_ERROR";
        VIEW_STATUS[VIEW_STATUS["CONFIRM"] = 6] = "CONFIRM";
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
        EventHandler.undoLastCommand = function () {
            var self = EventHandler._instance;
            if (self._lastCommand) {
                self._lastCommand.undo();
                self._lastCommand = null;
            }
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
                new FoodParent.RenderManageTreesViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), viewMode: option.viewMode }).execute();
            }
            FoodParent.View.getNavView().setActiveNavItem(viewStatus);
            FoodParent.View.setViewStatus(viewStatus);
        };
        EventHandler.handleMouseClick = function (el, view, options) {
            // Execute undo command.
            if (el.hasClass('undo')) {
                EventHandler.undoLastCommand();
            }
            // Make MessageView invisible.
            if (FoodParent.View.getMessageView()) {
                FoodParent.View.getMessageView().setInvisible();
            }
            // Handle specific event on each view status.
            switch (FoodParent.View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP }).execute();
                    }
                    else if (el.hasClass('home-menu-right')) {
                        new FoodParent.NavigateCommand({ hash: 'ptrees' }).execute();
                    }
                    break;
                case VIEW_STATUS.GEO_ERROR:
                case VIEW_STATUS.NETWORK_ERROR:
                    if (el.hasClass('alert-confirm')) {
                        new FoodParent.RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.CONFIRM:
                    if (el.hasClass('confirm-confirm') || el.hasClass('confirm-cancel')) {
                        new FoodParent.RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_TREES:
                    if (el.hasClass('marker-control-lock')) {
                        if (!options.marker.options.draggable) {
                            options.marker.options.draggable = true;
                            options.marker.dragging.enable();
                            el.html('<i class="fa fa-unlock-alt fa-2x"></i>');
                            options.marker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
                        }
                        else {
                            options.marker.options.draggable = false;
                            options.marker.dragging.disable();
                            el.html('<i class="fa fa-lock fa-2x"></i>');
                            options.marker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
                        }
                    }
                    else if (el.hasClass('marker-control-info')) {
                    }
                    else if (el.hasClass('marker-control-delete')) {
                        var tree = FoodParent.Model.getTrees().findWhere({ id: options.marker.options.id });
                        view.deleteTree(tree);
                    }
                    else if (el.hasClass('switch-table')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.TABLE }).execute();
                    }
                    else if (el.hasClass('switch-map')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP }).execute();
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
        EventHandler.handleDataChange = function (message, undoable) {
            var self = EventHandler._instance;
            console.log("!");
            if (self._lastCommand) {
                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: message, undoable: true }).execute();
            }
            else {
                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: message, undoable: false }).execute();
            }
        };
        EventHandler.handleTreeData = function (tree, dataMode, args, success, error, undoSuccess) {
            var self = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_LOCATION:
                    self._lastCommand = new FoodParent.UpdateTreeLocation({ tree: tree, marker: args.marker, location: args.location }, success, error);
                    break;
                case DATA_MODE.UPDATE_FLAG:
                    self._lastCommand = new FoodParent.UpdateTreeFlag({ tree: tree, flag: args.flag }, success, error);
                    break;
                case DATA_MODE.UPDATE_OWNERSHIP:
                    self._lastCommand = new FoodParent.UpdateTreeOwnership({ tree: tree, ownership: args.ownership }, success, error);
                    break;
                case DATA_MODE.UPDATE_FOODTYPE:
                    self._lastCommand = new FoodParent.UpdateTreeFoodType({ tree: tree, food: args.food }, success, error);
                    break;
                case DATA_MODE.UPDATE_DESCRIPTION:
                    self._lastCommand = new FoodParent.UpdateTreeDescription({ tree: tree, description: args.description }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    self._lastCommand = new FoodParent.AddNewTree({ tree: tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var command = new FoodParent.DeleteTree({ tree: tree }, success, error);
                    new FoodParent.RenderConfirmViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), message: "Are you sure to delete " + food.getName() + " " + tree.getName() + "?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        };
        EventHandler._instance = new EventHandler();
        EventHandler.TAG = "Controller - ";
        return EventHandler;
    })();
    FoodParent.EventHandler = EventHandler;
})(FoodParent || (FoodParent = {}));
