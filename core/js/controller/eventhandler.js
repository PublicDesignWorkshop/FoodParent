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
        DATA_MODE[DATA_MODE["UPDATE_NAME"] = 8] = "UPDATE_NAME";
        DATA_MODE[DATA_MODE["UPDATE_ADDRESS"] = 9] = "UPDATE_ADDRESS";
        DATA_MODE[DATA_MODE["UPDATE_CONTACT"] = 10] = "UPDATE_CONTACT";
        DATA_MODE[DATA_MODE["UPDATE_NEIGHBORHOOD"] = 11] = "UPDATE_NEIGHBORHOOD";
        DATA_MODE[DATA_MODE["UPDATE_AUTH"] = 12] = "UPDATE_AUTH";
        DATA_MODE[DATA_MODE["UPDATE_COMMENT"] = 13] = "UPDATE_COMMENT";
        DATA_MODE[DATA_MODE["UPDATE_RATING"] = 14] = "UPDATE_RATING";
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
        VIEW_STATUS[VIEW_STATUS["MANAGE_PEOPLE"] = 7] = "MANAGE_PEOPLE";
        VIEW_STATUS[VIEW_STATUS["MANAGE_ADOPTION"] = 8] = "MANAGE_ADOPTION";
        VIEW_STATUS[VIEW_STATUS["DETAIL_TREE"] = 9] = "DETAIL_TREE";
        VIEW_STATUS[VIEW_STATUS["IMAGENOTE_TREE"] = 10] = "IMAGENOTE_TREE";
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
            //if (View.getViewStatus() != viewStatus) {
            new FoodParent.RemoveChildViewCommand({ parent: FoodParent.View }).execute();
            //}
            new FoodParent.RenderNavViewCommand({ el: FoodParent.Setting.getNavWrapperElement(), viewStatus: viewStatus }).execute();
            if (viewStatus == VIEW_STATUS.HOME) {
                new FoodParent.MovePaceBarToTop().execute();
                new FoodParent.RenderHomeViewCommand({ el: FoodParent.Setting.getMainWrapperElement() }).execute();
            }
            else if (viewStatus == VIEW_STATUS.MANAGE_TREES) {
                new FoodParent.MovePaceBarToUnderNav().execute();
                new FoodParent.RenderManageTreesViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
            }
            else if (viewStatus == VIEW_STATUS.MANAGE_PEOPLE) {
                new FoodParent.MovePaceBarToUnderNav().execute();
                new FoodParent.RenderManagePeopleViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
            }
            else if (viewStatus == VIEW_STATUS.DETAIL_TREE) {
                new FoodParent.MovePaceBarToUnderNav().execute();
                new FoodParent.RenderDetailTreeViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
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
            // Handle NavView
            if (view instanceof FoodParent.NavView) {
                if (el.hasClass('item-manage-title')) {
                    new FoodParent.NavigateCommand({ hash: '' }).execute();
                }
                else if (el.hasClass('trees')) {
                    new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                }
                else if (el.hasClass('people')) {
                    new FoodParent.NavigateCommand({ hash: 'mpeople', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                }
            }
            // Handle specific event on each view status.
            switch (FoodParent.View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
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
                    else if (el.hasClass('marker-control-adoption')) {
                        new FoodParent.RenderManageAdoptionViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    else if (el.hasClass('marker-control-info')) {
                        new FoodParent.NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    }
                    else if (el.hasClass('marker-control-delete')) {
                        var tree = FoodParent.Model.getTrees().findWhere({ id: options.marker.options.id });
                        view.deleteTree(tree);
                    }
                    else if (el.hasClass('switch-table')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                    }
                    else if (el.hasClass('switch-map')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    }
                    else if (el.hasClass('mapview-item')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: options.id }).execute();
                    }
                    else if (el.hasClass('manage-adoption-item')) {
                        new FoodParent.RenderManageAdoptionViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    else if (el.hasClass('tree-detail')) {
                        new FoodParent.NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_ADOPTION:
                    if (el.hasClass('button-close')) {
                        new FoodParent.RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.DETAIL_TREE:
                    if (el.hasClass('content-chart')) {
                        new FoodParent.RenderImageNoteViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), note: options.note }).execute();
                    }
                    break;
                case VIEW_STATUS.IMAGENOTE_TREE:
                    if (el.hasClass('button-close')) {
                        new FoodParent.RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        if (FoodParent.View.getDetailTreeView()) {
                            FoodParent.View.getDetailTreeView().refreshTreeInfo();
                        }
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
            if (self._lastCommand) {
                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: message, undoable: true }).execute();
            }
            else {
                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: message, undoable: false }).execute();
            }
        };
        EventHandler.handlePersonData = function (person, dataMode, args, success, error, undoSuccess) {
            var self = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_NAME:
                    self._lastCommand = new FoodParent.UpdatePersonName({ person: person, name: args.name }, success, error);
                    break;
                case DATA_MODE.UPDATE_ADDRESS:
                    self._lastCommand = new FoodParent.UpdatePersonAddress({ person: person, address: args.address }, success, error);
                    break;
                case DATA_MODE.UPDATE_CONTACT:
                    self._lastCommand = new FoodParent.UpdatePersonContact({ person: person, contact: args.contact }, success, error);
                    break;
                case DATA_MODE.UPDATE_NEIGHBORHOOD:
                    self._lastCommand = new FoodParent.UpdatePersonNeightborhood({ person: person, neighborhood: args.neighborhood }, success, error);
                    break;
                case DATA_MODE.DELETE:
                    var command = new FoodParent.DeletePerson({ person: person }, success, error);
                    new FoodParent.RenderConfirmViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), message: "Are you sure to delete " + person.getName() + "?", command: command }).execute();
                    break;
                case DATA_MODE.UPDATE_AUTH:
                    self._lastCommand = new FoodParent.UpdatePersonAuth({ person: person, auth: args.auth }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    self._lastCommand = new FoodParent.CreatePerson({ person: person }, success, error);
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        };
        EventHandler.handleNoteData = function (note, dataMode, args, success, error, undoSuccess) {
            var self = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_COMMENT:
                    self._lastCommand = new FoodParent.UpdateNoteComment({ note: note, comment: args.comment }, success, error);
                    break;
                case DATA_MODE.UPDATE_RATING:
                    self._lastCommand = new FoodParent.UpdateNoteRating({ note: note, rate: args.rate }, success, error);
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
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
        EventHandler.handleAdoptionData = function (tree, person, dataMode, args, success, error, undoSuccess) {
            var self = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new FoodParent.CreateAdoption({ tree: tree, person: person }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    self._lastCommand = new FoodParent.DeleteAdoption({ tree: tree, person: person }, success, error, undoSuccess);
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
