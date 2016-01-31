module FoodParent {
    /*
    export enum ACTION_STATUS {
        NONE, IDLE, LOADING, LOADED, ERROR
    }
    */
    export enum DATA_MODE {
        NONE, CREATE, DELETE, UPDATE_LOCATION, UPDATE_FLAG, UPDATE_OWNERSHIP, UPDATE_FOODTYPE, UPDATE_DESCRIPTION, 
        UPDATE_NAME, UPDATE_ADDRESS, UPDATE_CONTACT, UPDATE_NEIGHBORHOOD, UPDATE_AUTH,
        UPDATE_COMMENT, UPDATE_RATING, UPDATE_COVER, UPDATE_DATE, ADD_PICTURE,
        ADD_DONATION_TREE, REMOVE_DONATION_TREE, UPDATE_DONATION_AMOUNT,
    }
    export enum VIEW_STATUS {
        NONE, HOME, MANAGE_TREES, PARENT_TREES, GEO_ERROR, NETWORK_ERROR, CONFIRM, MANAGE_PEOPLE, MANAGE_ADOPTION, DETAIL_TREE, IMAGENOTE_TREE, POST_NOTE, MANAGE_DONATIONS, ADD_DONATION, DETAIL_DONATION, EDIT_DONATION, LOGIN, SERVER_RESPONSE_ERROR, SIGNUP, ADOPT_TREE,
        CHANGE_PASSWORD
    }
    export enum VIEW_MODE {
        NONE, MAP, GRAPHIC, TABLE
    }
    export enum ERROR_MODE {
        NONE, GEO_PERMISSION_ERROR, SEVER_CONNECTION_ERROR, SEVER_RESPONSE_ERROR
    }
    export class EventHandler {
        private static _instance: EventHandler = new EventHandler();
        private static TAG: string = "Controller - ";
        private bDebug: boolean = true;
        private _lastCommand: Command;
        constructor(args?: any) {
            if (EventHandler._instance) {
                throw new Error("Error: Instantiation failed: Use EventHandler.getInstance() instead of new.");
            }
            EventHandler._instance = this;
        }
        public static getInstance(): EventHandler {
            return EventHandler._instance;
        }

        public static undoLastCommand(): void {
            var self: EventHandler = EventHandler._instance;
            if (self._lastCommand) {
                self._lastCommand.undo();
                self._lastCommand = null;
            }
        }

        public static handleNavigate(viewStatus: VIEW_STATUS, option?: any): void {
            Controller.abortAllXHR();
            Pace.restart();
            new RemoveAlertViewCommand().execute();
            //if (View.getViewStatus() != viewStatus) {
                new RemoveChildViewCommand({ parent: View }).execute();
            //}
            
            new RenderNavViewCommand({ el: Setting.getNavWrapperElement(), viewStatus: viewStatus }).execute();
            if (viewStatus == VIEW_STATUS.HOME) {
                new MovePaceBarToTop().execute();
                new RenderHomeViewCommand({ el: Setting.getMainWrapperElement() }).execute();
            } else if (viewStatus == VIEW_STATUS.MANAGE_TREES) {
                Controller.checkAdmin(function (response) {
                    if (response.result == false || response.result == 'false') {   // Not admin && in table view
                        if (option.viewMode == VIEW_MODE.TABLE) {
                            new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                        } else {
                            new MovePaceBarToUnderNav().execute();
                            new RenderManageTreesViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                        }
                    } else {
                        new MovePaceBarToUnderNav().execute();
                        new RenderManageTreesViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else if (viewStatus == VIEW_STATUS.MANAGE_PEOPLE) {
                Controller.checkAdmin(function (response) {
                    if (response.result == true || response.result == 'true') {   // Admin
                        new MovePaceBarToUnderNav().execute();
                        new RenderManagePeopleViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                    } else if (response.result == false || response.result == 'false') {   // Not admin
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else if (viewStatus == VIEW_STATUS.DETAIL_TREE) {
                new MovePaceBarToUnderNav().execute();
                new RenderDetailTreeViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
            } else if (viewStatus == VIEW_STATUS.MANAGE_DONATIONS) {
                Controller.checkAdmin(function (response) {
                    if (response.result == true || response.result == 'true') {   // Admin
                        new MovePaceBarToUnderNav().execute();
                        new RenderManageDonationsViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                    } else if (response.result == false || response.result == 'false') {   // Not admin
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else if (viewStatus == VIEW_STATUS.DETAIL_DONATION) {
                Controller.checkAdmin(function (response) {
                    if (response.result == true || response.result == 'true') {   // Admin
                        new MovePaceBarToUnderNav().execute();
                        new RenderDetailDonationViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                    } else if (response.result == false || response.result == 'false') {   // Not admin
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }

            View.getNavView().setActiveNavItem(viewStatus);
            View.setViewStatus(viewStatus);
        }

        public static handleMouseClick(el: JQuery, view: BaseView, options?: any): void {
            // Execute undo command.
            if (el.hasClass('undo')) {
                EventHandler.undoLastCommand();
            }
            // Make MessageView invisible.
            if (View.getMessageView()) {
                View.getMessageView().setInvisible();
            }
            // Handle NavView
            if (view instanceof NavView) {
                if (el.hasClass('item-manage-title')) {
                    new NavigateCommand({ hash: '' }).execute();
                } else if (el.hasClass('trees')) {
                    new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                } else if (el.hasClass('people')) {
                    Controller.checkAdmin(function (response) {
                        if (response.result == true || response.result == 'true') {   // Admin
                            new NavigateCommand({ hash: 'mpeople', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                        } else if (response.result == false || response.result == 'false') {   // Not admin
                            new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                        }
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    
                } else if (el.hasClass('donations')) {
                    Controller.checkAdmin(function (response) {
                        if (response.result == true || response.result == 'true') {   // Admin
                            new NavigateCommand({ hash: 'mdonations', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                        } else if (response.result == false || response.result == 'false') {   // Not admin
                            new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                        }
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    
                } else if (el.hasClass('login')) {
                    if (View.getViewStatus() != VIEW_STATUS.LOGIN) {
                        Controller.checkLogin(function (data) {
                            if (data.result == true || data.result == 'true') {   // Already logged in
                                new RenderLoggedInViewCommand({ el: Setting.getPopWrapperElement() }).execute();
                            } else {    // Not logged in
                                new RenderLogInViewCommand({ el: Setting.getPopWrapperElement() }).execute();
                            }
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    //new NavigateCommand({ hash: 'mdonations', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                } else if (el.hasClass('signup')) {
                    if (View.getViewStatus() != VIEW_STATUS.SIGNUP) {
                        new RenderSignUpViewCommand({ el: Setting.getPopWrapperElement() }).execute();
                    }
                }
            }

            // Handle specific event on each view status.
            switch (View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    } else if (el.hasClass('home-menu-right')) {
                        new NavigateCommand({ hash: 'ptrees' }).execute();
                    }
                    break;
                case VIEW_STATUS.GEO_ERROR:
                case VIEW_STATUS.NETWORK_ERROR:
                    if (el.hasClass('alert-confirm')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.CONFIRM:
                    if (el.hasClass('confirm-confirm') || el.hasClass('confirm-cancel')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_TREES:
                    if (el.hasClass('marker-control-lock')) {
                        if (!options.marker.options.draggable) {
                            options.marker.options.draggable = true;
                            options.marker.dragging.enable();
                            el.html('<i class="fa fa-unlock-alt fa-2x"></i>');
                            options.marker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
                        } else {
                            options.marker.options.draggable = false;
                            options.marker.dragging.disable();
                            el.html('<i class="fa fa-lock fa-2x"></i>');
                            options.marker._popup.setContent('<div class="marker-control-wrapper">' + $('.marker-control-wrapper').html() + '</div>');
                        }
                    } else if (el.hasClass('marker-control-adoption') || el.hasClass('button-manage-adoption')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    } else if (el.hasClass('marker-control-info') || el.hasClass('button-tree-detail')) {
                        new NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    } else if (el.hasClass('marker-control-delete')) {
                        var tree: Tree = Model.getTrees().findWhere({ id: options.marker.options.id });
                        (<ManageTreesMapView>view).deleteTree(tree);
                    } else if (el.hasClass('switch-table')) {   // Switch to table view.
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                    } else if (el.hasClass('switch-map')) {   // Switch to table view.
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    } else if (el.hasClass('mapview-item')) {   // Switch to map item view.
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: options.id }).execute();
                    } else if (el.hasClass('manage-adoption-item')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    } else if (el.hasClass('tree-detail')) {
                        new NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    } else if (el.hasClass('button-tree-adopt')) {
                        Controller.checkLogin(function (response) {
                            if (response.result == true || response.result == 'true') {   // Already logged in
                                new RenderAdoptTreeViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                            } else {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }
                        }, function (response) {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (el.hasClass('button-tree-unadopt')) {
                        Controller.checkLogin(function (response) {
                            if (response.result == true || response.result == 'true') {   // Already logged in
                                new RenderUnadoptTreeViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                            } else {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }
                        }, function (response) {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (el.hasClass('button-new-note')) {
                        var tree: Tree = Model.getTrees().findWhere({ id: parseInt(options.tree) });
                        new RenderPostNoteViewCommand({ el: Setting.getPopWrapperElement(), tree: tree }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_ADOPTION:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.DETAIL_TREE:
                    if (el.hasClass('content-chart')) {
                        if (options.note) {
                            new RenderImageNoteViewCommand({ el: Setting.getPopWrapperElement(), note: options.note }).execute();
                        }
                    } else if (el.hasClass('button-manage-adoption')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree.getId() }).execute();
                    } else if (el.hasClass('button-new-note')) {
                        new RenderPostNoteViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    } else if (el.hasClass('button-back-map')) {
                        Backbone.history.history.back();
                    } else if (el.hasClass('button-tree-adopt')) {
                        Controller.checkLogin(function (response) {
                            if (response.result == true || response.result == 'true') {   // Already logged in
                                new RenderAdoptTreeViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree.getId() }).execute();
                            } else {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }
                        }, function (response) {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (el.hasClass('button-tree-unadopt')) {
                        Controller.checkLogin(function (response) {
                            if (response.result == true || response.result == 'true') {   // Already logged in
                                new RenderUnadoptTreeViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree.getId() }).execute();
                            } else {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }
                        }, function (response) {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    break;
                case VIEW_STATUS.IMAGENOTE_TREE:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        if (View.getDetailTreeView()) {
                            (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                        }
                    }
                    break;
                case VIEW_STATUS.POST_NOTE:
                     if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        if (View.getDetailTreeView()) {
                            (<DetailTreeGraphicView>View.getDetailTreeView()).refreshTreeInfo();
                        }
                    }
                    break;
                case VIEW_STATUS.MANAGE_DONATIONS:
                    if (el.hasClass('manage-donation-item')) {
                        if (options.place != undefined) {
                            new RenderAddDonationViewCommand({ el: Setting.getPopWrapperElement(), place: options.place }).execute();
                        }
                    } else if (el.hasClass('location-detail')) {
                        new NavigateCommand({ hash: 'mdonation', viewMode: VIEW_MODE.GRAPHIC, id: options.place.getId() }).execute();
                        //new NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.ADD_DONATION:
                    if (el.hasClass('button-submit-donation')) {
                        
                    } else if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        if (View.getDetailDonationView()) {
                            (<DetailDonationView>View.getDetailDonationView()).refreshDonationInfo();
                        }
                    }
                    break;
                case VIEW_STATUS.DETAIL_DONATION:
                    if (el.hasClass('content-chart')) {
                        if (options.donation) {
                            new RenderEditDonationViewCommand({ el: Setting.getPopWrapperElement(), donation: options.donation }).execute();
                        }
                    } else if (el.hasClass('button-new-donation')) {
                        if (options.place) {
                            new RenderAddDonationViewCommand({ el: Setting.getPopWrapperElement(), place: options.place }).execute();
                        }
                        //new NavigateCommand({ hash: 'mtree', viewMode: VIEW_MODE.GRAPHIC, id: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.EDIT_DONATION:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        if (View.getDetailDonationView()) {
                            (<DetailDonationView>View.getDetailDonationView()).refreshDonationInfo();
                        }
                    } else if (el.hasClass('delete-donation')) {

                    }
                    break;
                case VIEW_STATUS.LOGIN:
                    if (el.hasClass('button-close') || el.hasClass('login-cancel') || el.hasClass('logged-cancel') || el.hasClass('signup-cancel')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    } else if (el.hasClass('login-submit')) {
                        if (options.contact != undefined && options.password != undefined) {
                            Controller.processLogin(options.contact, options.password, function (data) {
                                if (data.result == true || data.result == 'true') {
                                    //new RemoveAlertViewCommand({ delay: 0 }).execute();
                                    //new RenderNavViewCommand({ el: Setting.getNavWrapperElement(), viewStatus: View.getViewStatus() }).execute();
                                    Backbone.history.loadUrl(Backbone.history.fragment);
                                }
                                /*
                                switch (View.getViewStatus()) {
                                    case VIEW_STATUS.MANAGE_TREES:
                                        if (View.getManageTreesView()) {
                                            View.getManageTreesView().renderFilterList();
                                        }
                                        break;
                                }
                                */
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                    } else if (el.hasClass('logged-logout')) {
                        Controller.processLogout(function (data) {
                            if (data.result == true || data.result == 'true') {
                                //new RemoveAlertViewCommand({ delay: 0 }).execute();
                                //new RenderNavViewCommand({ el: Setting.getNavWrapperElement(), viewStatus: View.getViewStatus() }).execute();
                                Backbone.history.loadUrl(Backbone.history.fragment);
                            }
                            /*
                            switch (View.getViewStatus()) {
                                case VIEW_STATUS.MANAGE_TREES:
                                    if (View.getManageTreesView()) {
                                        View.getManageTreesView().renderFilterList();
                                    }
                                    break;
                            }
                            */
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    break;
                case VIEW_STATUS.SIGNUP:
                    if (el.hasClass('signup-cancel') || el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.ADOPT_TREE:
                    if (el.hasClass('adopt-cancel') || el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_PEOPLE:
                    if (el.hasClass('change-password')) {
                        Controller.checkAdmin(function (data) {
                            if (parseInt(data.auth) != 0 && parseInt(data.auth) > options.person.getAuth()) {
                                new RenderMessageViewCommand({
                                    el: Setting.getMessageWrapperElement(), message: "You <strong>don't</strong> have privilege to change <strong>higher level</strong> of authorization.", undoable: false
                                }).execute();
                            } else {
                                new RenderChangePasswordViewCommand({ el: Setting.getPopWrapperElement(), person: options.person }).execute();
                            }
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    break;
                case VIEW_STATUS.CHANGE_PASSWORD:
                    if (el.hasClass('password-cancel') || el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;

            }
        }

        public static handleMouseEnter(el: JQuery, view: BaseView): void {
            switch (View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('home-menu-left')) {
                        new FocusMenuLeftCommand().execute();
                    } else if (el.hasClass('home-menu-right')) {
                        new FocusMenuRightCommand().execute();
                    }
                    break;
            }
        }

        public static handleError(errorMode: ERROR_MODE, customMessage?: string): void {
            new RenderAlertViewCommand({ el: Setting.getPopWrapperElement(), errorMode: errorMode, customMessage: customMessage }).execute();
        }

        public static handleDataChange(message: string, undoable?: boolean): void {
            var self: EventHandler = EventHandler._instance;
            if (self._lastCommand) {
                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: message, undoable: true }).execute();
            } else {
                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: message, undoable: false }).execute();
            }
        }

        public static handlePersonData(person: Person, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_NAME:
                    self._lastCommand = new UpdatePersonName({ person: person, name: args.name }, success, error);
                    break;
                case DATA_MODE.UPDATE_ADDRESS:
                    self._lastCommand = new UpdatePersonAddress({ person: person, address: args.address }, success, error);
                    break;
                case DATA_MODE.UPDATE_CONTACT:
                    self._lastCommand = new UpdatePersonContact({ person: person, contact: args.contact }, success, error);
                    break;
                case DATA_MODE.UPDATE_NEIGHBORHOOD:
                    self._lastCommand = new UpdatePersonNeightborhood({ person: person, neighborhood: args.neighborhood }, success, error);
                    break;
                case DATA_MODE.DELETE:
                    var command: Command = new DeletePerson({ person: person }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete " + person.getName() + "?", command: command }).execute();
                    break;
                case DATA_MODE.UPDATE_AUTH:
                    self._lastCommand = new UpdatePersonAuth({ person: person, auth: args.auth }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    self._lastCommand = new CreatePerson({ person: person }, success, error);
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleNoteData(note: Note, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_COMMENT:
                    self._lastCommand = new UpdateNoteComment({ note: note, comment: args.comment }, success, error);
                    break;
                case DATA_MODE.UPDATE_RATING:
                    self._lastCommand = new UpdateNoteRating({ note: note, rate: args.rate }, success, error);
                    break;
                case DATA_MODE.UPDATE_COVER:
                    self._lastCommand = new UpdateNoteCover({ note: note, cover: args.cover }, success, error);
                    break;
                case DATA_MODE.UPDATE_DATE:
                    self._lastCommand = new UpdateNoteDate({ note: note, date: args.date }, success, error);
                    break;
                case DATA_MODE.ADD_PICTURE:
                    self._lastCommand = new AddNotePicture({ note: note, filename: args.filename }, success, error, undoSuccess);
                    break;
                case DATA_MODE.CREATE:
                    new CreateNote({ note: note }, success, error).execute();
                    break;
                case DATA_MODE.DELETE:
                    View.popViewStatus();
                    var command: Command = new DeleteNote({ note: note }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete this note?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleTreeData(tree: Tree, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.UPDATE_LOCATION:
                    self._lastCommand = new UpdateTreeLocation({ tree: tree, marker: args.marker, location: args.location }, success, error);
                    break;
                case DATA_MODE.UPDATE_FLAG:
                    self._lastCommand = new UpdateTreeFlag({ tree: tree, flag: args.flag, addmode: args.addmode }, success, error);
                    break;
                case DATA_MODE.UPDATE_OWNERSHIP:
                    self._lastCommand = new UpdateTreeOwnership({ tree: tree, ownership: args.ownership }, success, error);
                    break;
                case DATA_MODE.UPDATE_FOODTYPE:
                    self._lastCommand = new UpdateTreeFoodType({ tree: tree, food: args.food }, success, error);
                    break;
                case DATA_MODE.UPDATE_DESCRIPTION:
                    self._lastCommand = new UpdateTreeDescription({ tree: tree, description: args.description }, success, error);
                    break;
                case DATA_MODE.UPDATE_ADDRESS:
                    self._lastCommand = new UpdateTreeAddress({ tree: tree, address: args.address }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    self._lastCommand = new AddNewTree({ tree: tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var command: Command = new DeleteTree({ tree: tree }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete " + food.getName() + " " + tree.getName() + "?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleAdoptionData(tree: Tree, person: Person, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new CreateAdoption({ tree: tree, person: person }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    self._lastCommand = new DeleteAdoption({ tree: tree, person: person }, success, error, undoSuccess);
                    break;

            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleDonationData(donation: Donation, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new CreateDonation({ donation: donation }, success, error, undoSuccess);
                    break;
                case DATA_MODE.ADD_PICTURE:
                    self._lastCommand = new AddDonationPicture({ donation: donation, filename: args.filename }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_COVER:
                    self._lastCommand = new UpdateDonationCover({ donation: donation, cover: args.cover }, success, error);
                    break;
                case DATA_MODE.UPDATE_DATE:
                    self._lastCommand = new UpdateDonationDate({ donation: donation, date: args.date }, success, error);
                    break;
                case DATA_MODE.ADD_DONATION_TREE:
                    self._lastCommand = new AddDonationTree({ donation: donation, tree: args.tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.REMOVE_DONATION_TREE:
                    self._lastCommand = new RemoveDonationTree({ donation: donation, tree: args.tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_DONATION_AMOUNT:
                    self._lastCommand = new UpdateDonationAmount({ donation: donation, amount: args.amount }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    View.popViewStatus();
                    var command: Command = new DeleteDonation({ donation: donation }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete this donation?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handlePlaceData(place: Place, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undoSuccess?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new CreateLocation({ place: place }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_NAME:
                    self._lastCommand = new UpdateLocationName({ place: place, name: args.name }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_DESCRIPTION:
                    self._lastCommand = new UpdateLocationDescription({ place: place, description: args.description }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_LOCATION:
                    self._lastCommand = new UpdateLocationLocation({ place: place, marker: args.marker, location: args.location }, success, error);
                    break;
                case DATA_MODE.UPDATE_ADDRESS:
                    self._lastCommand = new UpdateLocationAddress({ place: place, address: args.address }, success, error);
                    break;
                case DATA_MODE.DELETE:
                    var command: Command = new DeleteLocation({ place: place }, success, error);
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete this location?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }
    }
}