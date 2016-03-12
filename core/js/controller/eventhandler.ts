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
        NONE, HOME, CONFIRM,
        TREES, TREES_TABLE,
        TREE,
        PARENT_TREES, GEO_ERROR, NETWORK_ERROR, MANAGE_PEOPLE, MANAGE_ADOPTION, IMAGENOTE_TREE, POST_NOTE, MANAGE_DONATIONS, ADD_DONATION, DETAIL_DONATION, EDIT_DONATION, LOGIN, SERVER_RESPONSE_ERROR, SIGNUP, ADOPT_TREE, UNADOPT_TREE,
        CHANGE_PASSWORD
    }
    export enum CREDENTIAL_MODE {
        NONE, GUEST, PARENT, ADMIN
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

        public static handleKeyCode(code: number): void {
            var self: EventHandler = EventHandler._instance;
            switch (View.getViewStatus()) {
                case VIEW_STATUS.TREES:
                    switch (code) {
                        case 27:    // esc
                            //View.getTreesView().removeTreeInfo();
                            //View.getTreesView().closeMapFilter();
                            break;
                    }
                    break;
            }
        }

        public static handleNavigate(viewStatus: VIEW_STATUS, option?: any): void {
            var self: EventHandler = EventHandler._instance;
            Controller.abortAllXHR();
            Pace.restart();
            //new RemoveAlertViewCommand().execute();
            //if (View.getViewStatus() != viewStatus) {
                new RemoveChildViewCommand({ parent: View }).execute();
            //}
            new RenderNavViewCommand({ el: Setting.getNavWrapperElement(), viewStatus: viewStatus }).execute();
            switch (viewStatus) {
                case VIEW_STATUS.HOME:
                    new RenderHomeViewCommand({ el: Setting.getMainWrapperElement() }).execute();
                    break;
                case VIEW_STATUS.TREES:
                    Controller.checkIsLoggedIn(function () {
                        Controller.checkIsAdmin(function () {
                            new RenderTreesViewCommand({ el: Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.ADMIN }).execute();
                        }, function () {
                            new RenderTreesViewCommand({ el: Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.PARENT }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }, function () {
                        new RenderTreesViewCommand({ el: Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.GUEST }).execute();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    break;
                case VIEW_STATUS.TREE:
                    Controller.checkIsLoggedIn(function () {
                        Controller.checkIsAdmin(function () {
                            new RenderTreeViewCommand({ el: Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.ADMIN }).execute();
                        }, function () {
                            new RenderTreeViewCommand({ el: Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.PARENT }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }, function () {
                        new RenderTreeViewCommand({ el: Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.GUEST }).execute();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    break;
            }
            /*
            if (viewStatus == VIEW_STATUS.HOME) {
                //new MovePaceBarToTop().execute();
               
            } else if (viewStatus == VIEW_STATUS.TREES) {
                Controller.checkAdmin(function (response) {
                    if (response.result == false || response.result == 'false') {   // Not admin && in table view
                        if (option.viewMode == VIEW_MODE.TABLE) {
                            new NavigateCommand({ hash: 'trees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                        } else {
                            //new MovePaceBarToUnderNav().execute();
                            new RenderManageTreesViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                        }
                    } else {
                        //new MovePaceBarToUnderNav().execute();
                        new RenderManageTreesViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else if (viewStatus == VIEW_STATUS.MANAGE_PEOPLE) {
                Controller.checkAdmin(function (response) {
                    if (response.result == true || response.result == 'true') {   // Admin
                        //new MovePaceBarToUnderNav().execute();
                        new RenderManagePeopleViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                    } else if (response.result == false || response.result == 'false') {   // Not admin
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            } else if (viewStatus == VIEW_STATUS.TREE) {
                //new MovePaceBarToUnderNav().execute();
                new RenderDetailTreeViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
            } else if (viewStatus == VIEW_STATUS.MANAGE_DONATIONS) {
                Controller.checkAdmin(function (response) {
                    if (response.result == true || response.result == 'true') {   // Admin
                        //new MovePaceBarToUnderNav().execute();
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
                        //new MovePaceBarToUnderNav().execute();
                        new RenderDetailDonationViewCommand({ el: Setting.getMainWrapperElement(), viewMode: option.viewMode, id: option.id }).execute();
                    } else if (response.result == false || response.result == 'false') {   // Not admin
                        new NavigateCommand({ hash: 'mtrees', viewMode: VIEW_MODE.MAP, id: 0 }).execute();
                    }
                }, function () {
                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                });
            }
            */

            //View.getNavView().update(viewStatus);
            View.setViewStatus(viewStatus);
        }

        public static handleMouseClick(el: JQuery, view: BaseView, options?: any): void {
            var self: EventHandler = EventHandler._instance;
            // Execute undo command.
            if (el.hasClass('undo')) {
                EventHandler.undoLastCommand();
            }
            // Make MessageView invisible.
            if (View.getMessageView()) {
                View.getMessageView().setInvisible();
            }
            // Handle navigation view mouse click event
            if (view instanceof NavView) {
                if (el.hasClass('evt-title')) {
                    new ResetPopupViewCommand().execute();
                    new NavigateCommand({ hash: 'trees', id: 0 }).execute();
                    Backbone.history.loadUrl(Backbone.history.fragment);
                } else if (el.hasClass('evt-trees')) {
                    if (View.getViewStatus() != VIEW_STATUS.TREES) {
                        new ResetPopupViewCommand().execute();
                        new NavigateCommand({ hash: 'trees', id: 0 }).execute();
                        new RefreshCurrentViewCommand().execute();
                    }
                } else if (el.hasClass('people')) {
                    Controller.checkAdmin(function (response) {
                        if (response.result == true || response.result == 'true') {   // Admin
                            new NavigateCommand({ hash: 'mpeople', id: 0 }).execute();
                        } else if (response.result == false || response.result == 'false') {   // Not admin
                            new NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                        }
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    
                } else if (el.hasClass('donations')) {
                    Controller.checkAdmin(function (response) {
                        if (response.result == true || response.result == 'true') {   // Admin
                            new NavigateCommand({ hash: 'mdonations', id: 0 }).execute();
                        } else if (response.result == false || response.result == 'false') {   // Not admin
                            new NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                        }
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                } else if (el.hasClass('evt-login')) {
                    if (View.getViewStatus() != VIEW_STATUS.LOGIN) {
                        Controller.checkIsLoggedIn(function (response) {
                            Controller.checkIsAdmin(function () {
                                new RenderAccountViewCommand({ el: Setting.getPopWrapperElement() }).execute();
                            }, function () {
                                new RenderAccountViewCommand({ el: Setting.getPopWrapperElement() }).execute();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }, function () {
                            new RenderLogInViewCommand({ el: Setting.getPopWrapperElement() }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    //new NavigateCommand({ hash: 'mdonations', viewMode: VIEW_MODE.TABLE, id: 0 }).execute();
                } else if (el.hasClass('evt-logout')) {
                    
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
                    if (el.hasClass('button-logo')) {
                        new NavigateCommand({ hash: 'trees', id: 0 }).execute();
                    }
                    break;
                case VIEW_STATUS.GEO_ERROR:
                case VIEW_STATUS.NETWORK_ERROR:
                    if (el.hasClass('alert-confirm')) {
                        new RemoveAlertViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
                case VIEW_STATUS.CONFIRM:
                    if (el.hasClass('evt-close') || el.hasClass('evt-submit')) {
                        new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        new RefreshCurrentViewCommand().execute();
                    }
                    break;
                case VIEW_STATUS.TREES:
                    if (el.hasClass('marker-control-adoption') || el.hasClass('button-manage-adoption')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    } else if (el.hasClass('marker-control-info') || el.hasClass('button-tree-detail')) {
                        new NavigateCommand({ hash: 'mtree', id: options.tree }).execute();
                    } else if (el.hasClass('marker-control-delete')) {
                        var tree: Tree = Model.getTrees().findWhere({ id: options.marker.options.id });
                        (<ManageTreesMapView>view).deleteTree(tree);
                    } else if (el.hasClass('switch-table')) {   // Switch to table view.
                        new NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                    } else if (el.hasClass('switch-map')) {   // Switch to table view.
                        new NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                    } else if (el.hasClass('mapview-item')) {   // Switch to map item view.
                        new NavigateCommand({ hash: 'mtrees', id: options.id }).execute();
                    } else if (el.hasClass('evt-manage-adopt')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    } else if (el.hasClass('evt-tree-table')) {
                        new RenderTreesTableViewCommand({ el: Setting.getPopWrapperElement() }).execute();
                    } else if (el.hasClass('tree-detail')) {
                        new NavigateCommand({ hash: 'mtree', id: options.tree }).execute();
                    } else if (el.hasClass('evt-adopt')) {
                        Controller.checkIsLoggedIn(function (response) {
                            new RenderAdoptTreeViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                        }, function (response) {
                            new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (el.hasClass('evt-unadopt')) {
                        Controller.checkIsLoggedIn(function (response) {
                            new RenderUnadoptTreeViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                        }, function (response) {
                            new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (el.hasClass('evt-location')) {
                        new UpdateCurrentPositionCommand().execute();
                    } else if (el.hasClass('button-new-note')) {
                        var tree: Tree = Model.getTrees().findWhere({ id: parseInt(options.tree) });
                        new RenderPostNoteViewCommand({ el: Setting.getPopWrapperElement(), tree: tree }).execute();
                    } else if (el.hasClass('evt-add-tree')) {
                        var tree: Tree = options.tree;
                        EventHandler.handleTreeData(tree, DATA_MODE.CREATE, {}, function () {
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            new RefreshCurrentViewCommand().execute();
                            FoodParent.Router.getInstance().navigate("trees/" + tree.getId(), { trigger: true, replace: true });
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been created successfully.", true);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        }, function () {
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", false);
                            new RefreshCurrentViewCommand().execute();
                        });
                    } else if (el.hasClass('evt-tree-remove')) {
                        var tree: Tree = Model.getTrees().findWhere({ id: options.marker.options.id });
                        EventHandler.handleTreeData(tree, DATA_MODE.DELETE, {}, function () {
                            var food: Food = Model.getFoods().findWhere({ id: tree.getFoodId() });
                            new RefreshCurrentViewCommand().execute();
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has deleted successfully.", false);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    } else if (el.hasClass('evt-detail')) {
                        new NavigateCommand({ hash: 'tree', id: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.TREES_TABLE:
                    if (el.hasClass('evt-close')) {
                        new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        new RefreshCurrentViewCommand().execute();
                    } else if (el.hasClass('evt-manage-adopt')) {
                        new RenderManageAdoptionViewCommand({ el: Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_ADOPTION:
                    if (el.hasClass('evt-close')) {
                        new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        new RefreshCurrentViewCommand().execute();
                    }
                    break;
                case VIEW_STATUS.TREE:
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
                        new NavigateCommand({ hash: 'mdonation', id: options.place.getId() }).execute();
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
                    if (el.hasClass('evt-close')) {
                        new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                        new RefreshCurrentViewCommand().execute();
                    } else if (el.hasClass('evt-submit')) {
                        if (options.contact != undefined && options.password != undefined) {
                            Controller.processLogin(options.contact, options.password, function (response) {
                                new ResetPopupViewCommand().execute();
                                Backbone.history.loadUrl(Backbone.history.fragment);
                            }, function (response) {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                                }, function (response) {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                    } else if (el.hasClass('evt-logout')) {
                        Controller.processLogout(function () {
                            new ResetPopupViewCommand().execute();
                            Backbone.history.loadUrl(Backbone.history.fragment);
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
                    if (el.hasClass('evt-close')) {
                        new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    } else if (el.hasClass('evt-submit')) {
                        if (options.tree) {
                            Controller.checkIsLoggedIn(function (response) {
                                var food: Food = Model.getFoods().findWhere({ id: options.tree.getFoodId() });
                                var person: Person = Model.getPersons().findWhere({ id: parseInt(response.id) });
                                EventHandler.handleAdoptionData(options.tree, person, DATA_MODE.CREATE, {}, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                                    new RefreshCurrentViewCommand().execute();
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                }, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new RefreshCurrentViewCommand().execute();
                                });
                            }, function (response) {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                    }
                    break;
                case VIEW_STATUS.UNADOPT_TREE:
                    if (el.hasClass('evt-close')) {
                        new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                    } else if (el.hasClass('evt-submit')) {
                        if (options.tree) {
                            Controller.checkIsLoggedIn(function (response) {
                                var food: Food = Model.getFoods().findWhere({ id: options.tree.getFoodId() });
                                var person: Person = Model.getPersons().findWhere({ id: parseInt(response.id) });
                                EventHandler.handleAdoptionData(options.tree, person, DATA_MODE.DELETE, {}, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new RemovePopupViewCommand({ delay: Setting.getRemovePopupDuration() }).execute();
                                    new RefreshCurrentViewCommand().execute();
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                }, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new RefreshCurrentViewCommand().execute();
                                });
                            }, function (response) {
                                new RenderMessageViewCommand({ el: Setting.getMessageWrapperElement(), message: Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
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
                    new RenderConfirmViewCommand({ el: Setting.getPopWrapperElement(), message: "Are you sure to delete '" + food.getName() + " " + tree.getName() + "' ?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        }

        public static handleAdoptionData(tree: Tree, person: Person, dataMode: DATA_MODE, args: any, success?: Function, error?: Function, undo?: Function): void {
            var self: EventHandler = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new CreateAdoption({ tree: tree, person: person }, success, error, undo);
                    break;
                case DATA_MODE.DELETE:
                    self._lastCommand = new DeleteAdoption({ tree: tree, person: person }, success, error, undo);
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