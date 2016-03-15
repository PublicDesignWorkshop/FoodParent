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
        DATA_MODE[DATA_MODE["UPDATE_COVER"] = 15] = "UPDATE_COVER";
        DATA_MODE[DATA_MODE["UPDATE_DATE"] = 16] = "UPDATE_DATE";
        DATA_MODE[DATA_MODE["ADD_PICTURE"] = 17] = "ADD_PICTURE";
        DATA_MODE[DATA_MODE["ADD_DONATION_TREE"] = 18] = "ADD_DONATION_TREE";
        DATA_MODE[DATA_MODE["REMOVE_DONATION_TREE"] = 19] = "REMOVE_DONATION_TREE";
        DATA_MODE[DATA_MODE["UPDATE_DONATION_AMOUNT"] = 20] = "UPDATE_DONATION_AMOUNT";
    })(FoodParent.DATA_MODE || (FoodParent.DATA_MODE = {}));
    var DATA_MODE = FoodParent.DATA_MODE;
    (function (VIEW_STATUS) {
        VIEW_STATUS[VIEW_STATUS["NONE"] = 0] = "NONE";
        VIEW_STATUS[VIEW_STATUS["HOME"] = 1] = "HOME";
        VIEW_STATUS[VIEW_STATUS["CONFIRM"] = 2] = "CONFIRM";
        VIEW_STATUS[VIEW_STATUS["TREES"] = 3] = "TREES";
        VIEW_STATUS[VIEW_STATUS["TREES_TABLE"] = 4] = "TREES_TABLE";
        VIEW_STATUS[VIEW_STATUS["TREE"] = 5] = "TREE";
        VIEW_STATUS[VIEW_STATUS["POST_NOTE"] = 6] = "POST_NOTE";
        VIEW_STATUS[VIEW_STATUS["PARENT_TREES"] = 7] = "PARENT_TREES";
        VIEW_STATUS[VIEW_STATUS["GEO_ERROR"] = 8] = "GEO_ERROR";
        VIEW_STATUS[VIEW_STATUS["NETWORK_ERROR"] = 9] = "NETWORK_ERROR";
        VIEW_STATUS[VIEW_STATUS["MANAGE_PEOPLE"] = 10] = "MANAGE_PEOPLE";
        VIEW_STATUS[VIEW_STATUS["MANAGE_ADOPTION"] = 11] = "MANAGE_ADOPTION";
        VIEW_STATUS[VIEW_STATUS["IMAGENOTE_TREE"] = 12] = "IMAGENOTE_TREE";
        VIEW_STATUS[VIEW_STATUS["MANAGE_DONATIONS"] = 13] = "MANAGE_DONATIONS";
        VIEW_STATUS[VIEW_STATUS["ADD_DONATION"] = 14] = "ADD_DONATION";
        VIEW_STATUS[VIEW_STATUS["DETAIL_DONATION"] = 15] = "DETAIL_DONATION";
        VIEW_STATUS[VIEW_STATUS["EDIT_DONATION"] = 16] = "EDIT_DONATION";
        VIEW_STATUS[VIEW_STATUS["LOGIN"] = 17] = "LOGIN";
        VIEW_STATUS[VIEW_STATUS["SERVER_RESPONSE_ERROR"] = 18] = "SERVER_RESPONSE_ERROR";
        VIEW_STATUS[VIEW_STATUS["SIGNUP"] = 19] = "SIGNUP";
        VIEW_STATUS[VIEW_STATUS["ADOPT_TREE"] = 20] = "ADOPT_TREE";
        VIEW_STATUS[VIEW_STATUS["UNADOPT_TREE"] = 21] = "UNADOPT_TREE";
        VIEW_STATUS[VIEW_STATUS["CHANGE_PASSWORD"] = 22] = "CHANGE_PASSWORD";
    })(FoodParent.VIEW_STATUS || (FoodParent.VIEW_STATUS = {}));
    var VIEW_STATUS = FoodParent.VIEW_STATUS;
    (function (CREDENTIAL_MODE) {
        CREDENTIAL_MODE[CREDENTIAL_MODE["NONE"] = 0] = "NONE";
        CREDENTIAL_MODE[CREDENTIAL_MODE["GUEST"] = 1] = "GUEST";
        CREDENTIAL_MODE[CREDENTIAL_MODE["PARENT"] = 2] = "PARENT";
        CREDENTIAL_MODE[CREDENTIAL_MODE["ADMIN"] = 3] = "ADMIN";
    })(FoodParent.CREDENTIAL_MODE || (FoodParent.CREDENTIAL_MODE = {}));
    var CREDENTIAL_MODE = FoodParent.CREDENTIAL_MODE;
    (function (ERROR_MODE) {
        ERROR_MODE[ERROR_MODE["NONE"] = 0] = "NONE";
        ERROR_MODE[ERROR_MODE["GEO_PERMISSION_ERROR"] = 1] = "GEO_PERMISSION_ERROR";
        ERROR_MODE[ERROR_MODE["SEVER_CONNECTION_ERROR"] = 2] = "SEVER_CONNECTION_ERROR";
        ERROR_MODE[ERROR_MODE["SEVER_RESPONSE_ERROR"] = 3] = "SEVER_RESPONSE_ERROR";
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
        EventHandler.handleKeyCode = function (code) {
            var self = EventHandler._instance;
            switch (FoodParent.View.getViewStatus()) {
                case VIEW_STATUS.TREES:
                    switch (code) {
                        case 27:
                            //View.getTreesView().removeTreeInfo();
                            //View.getTreesView().closeMapFilter();
                            break;
                    }
                    break;
            }
        };
        EventHandler.handleNavigate = function (viewStatus, option) {
            var self = EventHandler._instance;
            FoodParent.Controller.abortAllXHR();
            Pace.restart();
            //new RemoveAlertViewCommand().execute();
            //if (View.getViewStatus() != viewStatus) {
            new FoodParent.RemoveChildViewCommand({ parent: FoodParent.View }).execute();
            //}
            new FoodParent.RenderNavViewCommand({ el: FoodParent.Setting.getNavWrapperElement(), viewStatus: viewStatus }).execute();
            switch (viewStatus) {
                case VIEW_STATUS.HOME:
                    new FoodParent.RenderHomeViewCommand({ el: FoodParent.Setting.getMainWrapperElement() }).execute();
                    break;
                case VIEW_STATUS.TREES:
                    FoodParent.Controller.checkIsLoggedIn(function () {
                        FoodParent.Controller.checkIsAdmin(function () {
                            new FoodParent.RenderTreesViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.ADMIN }).execute();
                        }, function () {
                            new FoodParent.RenderTreesViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.PARENT }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }, function () {
                        new FoodParent.RenderTreesViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.GUEST }).execute();
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                    break;
                case VIEW_STATUS.TREE:
                    FoodParent.Controller.checkIsLoggedIn(function () {
                        FoodParent.Controller.checkIsAdmin(function () {
                            new FoodParent.RenderTreeViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.ADMIN }).execute();
                        }, function () {
                            new FoodParent.RenderTreeViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.PARENT }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }, function () {
                        new FoodParent.RenderTreeViewCommand({ el: FoodParent.Setting.getMainWrapperElement(), id: option.id, credential: CREDENTIAL_MODE.GUEST }).execute();
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
            FoodParent.View.setViewStatus(viewStatus);
        };
        EventHandler.handleMouseClick = function (el, view, options) {
            var self = EventHandler._instance;
            // Execute undo command.
            if (el.hasClass('undo')) {
                EventHandler.undoLastCommand();
            }
            // Make MessageView invisible.
            if (FoodParent.View.getMessageView()) {
                FoodParent.View.getMessageView().setInvisible();
            }
            // Handle navigation view mouse click event
            if (view instanceof FoodParent.NavView) {
                if (el.hasClass('evt-title')) {
                    new FoodParent.ResetPopupViewCommand().execute();
                    new FoodParent.NavigateCommand({ hash: 'trees', id: 0 }).execute();
                    Backbone.history.loadUrl(Backbone.history.fragment);
                }
                else if (el.hasClass('evt-trees')) {
                    if (FoodParent.View.getViewStatus() != VIEW_STATUS.TREES) {
                        new FoodParent.ResetPopupViewCommand().execute();
                        new FoodParent.NavigateCommand({ hash: 'trees', id: 0 }).execute();
                        new FoodParent.RefreshCurrentViewCommand().execute();
                    }
                }
                else if (el.hasClass('people')) {
                    FoodParent.Controller.checkAdmin(function (response) {
                        if (response.result == true || response.result == 'true') {
                            new FoodParent.NavigateCommand({ hash: 'mpeople', id: 0 }).execute();
                        }
                        else if (response.result == false || response.result == 'false') {
                            new FoodParent.NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                        }
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
                else if (el.hasClass('donations')) {
                    FoodParent.Controller.checkAdmin(function (response) {
                        if (response.result == true || response.result == 'true') {
                            new FoodParent.NavigateCommand({ hash: 'mdonations', id: 0 }).execute();
                        }
                        else if (response.result == false || response.result == 'false') {
                            new FoodParent.NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                        }
                    }, function () {
                        EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                    });
                }
                else if (el.hasClass('evt-login')) {
                    if (FoodParent.View.getViewStatus() != VIEW_STATUS.LOGIN) {
                        FoodParent.Controller.checkIsLoggedIn(function (response) {
                            FoodParent.Controller.checkIsAdmin(function () {
                                new FoodParent.RenderAccountViewCommand({ el: FoodParent.Setting.getPopWrapperElement() }).execute();
                            }, function () {
                                new FoodParent.RenderAccountViewCommand({ el: FoodParent.Setting.getPopWrapperElement() }).execute();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }, function () {
                            new FoodParent.RenderLogInViewCommand({ el: FoodParent.Setting.getPopWrapperElement() }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                }
                else if (el.hasClass('evt-logout')) {
                }
            }
            // Handle specific event on each view status.
            switch (FoodParent.View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
                case VIEW_STATUS.HOME:
                    if (el.hasClass('button-logo')) {
                        new FoodParent.NavigateCommand({ hash: 'trees', id: 0 }).execute();
                    }
                    break;
                case VIEW_STATUS.GEO_ERROR:
                case VIEW_STATUS.NETWORK_ERROR:
                    if (el.hasClass('alert-confirm')) {
                    }
                    break;
                case VIEW_STATUS.CONFIRM:
                    if (el.hasClass('evt-close') || el.hasClass('evt-submit')) {
                        new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        new FoodParent.RefreshCurrentViewCommand().execute();
                    }
                    break;
                case VIEW_STATUS.TREES:
                    if (el.hasClass('marker-control-adoption') || el.hasClass('button-manage-adoption')) {
                        new FoodParent.RenderManageAdoptionViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    else if (el.hasClass('marker-control-info') || el.hasClass('button-tree-detail')) {
                        new FoodParent.NavigateCommand({ hash: 'mtree', id: options.tree }).execute();
                    }
                    else if (el.hasClass('marker-control-delete')) {
                        var tree = FoodParent.Model.getTrees().findWhere({ id: options.marker.options.id });
                        view.deleteTree(tree);
                    }
                    else if (el.hasClass('switch-table')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                    }
                    else if (el.hasClass('switch-map')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', id: 0 }).execute();
                    }
                    else if (el.hasClass('mapview-item')) {
                        new FoodParent.NavigateCommand({ hash: 'mtrees', id: options.id }).execute();
                    }
                    else if (el.hasClass('evt-manage-adopt')) {
                        new FoodParent.RenderManageAdoptionViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    else if (el.hasClass('evt-tree-table')) {
                        new FoodParent.RenderTreesTableViewCommand({ el: FoodParent.Setting.getPopWrapperElement() }).execute();
                    }
                    else if (el.hasClass('tree-detail')) {
                        new FoodParent.NavigateCommand({ hash: 'mtree', id: options.tree }).execute();
                    }
                    else if (el.hasClass('evt-adopt')) {
                        FoodParent.Controller.checkIsLoggedIn(function (response) {
                            new FoodParent.RenderAdoptTreeViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                        }, function (response) {
                            new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else if (el.hasClass('evt-unadopt')) {
                        FoodParent.Controller.checkIsLoggedIn(function (response) {
                            new FoodParent.RenderUnadoptTreeViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                        }, function (response) {
                            new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else if (el.hasClass('evt-location')) {
                        new FoodParent.UpdateCurrentPositionCommand().execute();
                    }
                    else if (el.hasClass('button-new-note')) {
                        var tree = FoodParent.Model.getTrees().findWhere({ id: parseInt(options.tree) });
                        new FoodParent.RenderPostNoteViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: tree }).execute();
                    }
                    else if (el.hasClass('evt-add-tree')) {
                        var tree = options.tree;
                        EventHandler.handleTreeData(tree, DATA_MODE.CREATE, {}, function () {
                            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            new FoodParent.RefreshCurrentViewCommand().execute();
                            FoodParent.Router.getInstance().navigate("trees/" + tree.getId(), { trigger: true, replace: true });
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been created successfully.", true);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        }, function () {
                            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has been deleted successfully.", false);
                            new FoodParent.RefreshCurrentViewCommand().execute();
                        });
                    }
                    else if (el.hasClass('evt-tree-remove')) {
                        var tree = FoodParent.Model.getTrees().findWhere({ id: options.marker.options.id });
                        EventHandler.handleTreeData(tree, DATA_MODE.DELETE, {}, function () {
                            var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                            new FoodParent.RefreshCurrentViewCommand().execute();
                            EventHandler.handleDataChange("<strong><i>" + food.getName() + " " + tree.getName() + "</i></strong> has deleted successfully.", false);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else if (el.hasClass('evt-detail')) {
                        new FoodParent.NavigateCommand({ hash: 'tree', id: options.tree }).execute();
                    }
                    else if (el.hasClass('evt-post')) {
                        var tree = FoodParent.Model.getTrees().findWhere({ id: parseInt(options.tree) });
                        FoodParent.Controller.checkIsLoggedIn(function () {
                            FoodParent.Controller.checkIsAdmin(function () {
                                new FoodParent.RenderPostNoteViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: tree, credential: CREDENTIAL_MODE.ADMIN }).execute();
                            }, function () {
                                new FoodParent.RenderPostNoteViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: tree, credential: CREDENTIAL_MODE.PARENT }).execute();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }, function () {
                            new FoodParent.RenderPostNoteViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: tree, credential: CREDENTIAL_MODE.GUEST }).execute();
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    break;
                case VIEW_STATUS.TREES_TABLE:
                    if (el.hasClass('evt-close')) {
                        new FoodParent.ResetPopupViewCommand().execute();
                        Backbone.history.loadUrl(Backbone.history.fragment);
                    }
                    else if (el.hasClass('evt-manage-adopt')) {
                        new FoodParent.RenderManageAdoptionViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    break;
                case VIEW_STATUS.MANAGE_ADOPTION:
                    if (el.hasClass('evt-close')) {
                        new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        new FoodParent.RefreshCurrentViewCommand().execute();
                    }
                    break;
                case VIEW_STATUS.TREE:
                    if (el.hasClass('content-chart')) {
                        if (options.note) {
                            new FoodParent.RenderImageNoteViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), note: options.note }).execute();
                        }
                    }
                    else if (el.hasClass('button-manage-adoption')) {
                        new FoodParent.RenderManageAdoptionViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree.getId() }).execute();
                    }
                    else if (el.hasClass('button-new-note')) {
                        new FoodParent.RenderPostNoteViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree }).execute();
                    }
                    else if (el.hasClass('button-back-map')) {
                        Backbone.history.history.back();
                    }
                    else if (el.hasClass('button-tree-adopt')) {
                        FoodParent.Controller.checkLogin(function (response) {
                            if (response.result == true || response.result == 'true') {
                                new FoodParent.RenderAdoptTreeViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree.getId() }).execute();
                            }
                            else {
                                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }
                        }, function (response) {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else if (el.hasClass('button-tree-unadopt')) {
                        FoodParent.Controller.checkLogin(function (response) {
                            if (response.result == true || response.result == 'true') {
                                new FoodParent.RenderUnadoptTreeViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), tree: options.tree.getId() }).execute();
                            }
                            else {
                                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }
                        }, function (response) {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    break;
                case VIEW_STATUS.IMAGENOTE_TREE:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        if (FoodParent.View.getDetailTreeView()) {
                            FoodParent.View.getDetailTreeView().refreshTreeInfo();
                        }
                    }
                    break;
                case VIEW_STATUS.POST_NOTE:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        if (FoodParent.View.getDetailTreeView()) {
                            FoodParent.View.getDetailTreeView().refreshTreeInfo();
                        }
                    }
                    break;
                case VIEW_STATUS.MANAGE_DONATIONS:
                    if (el.hasClass('manage-donation-item')) {
                        if (options.place != undefined) {
                            new FoodParent.RenderAddDonationViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), place: options.place }).execute();
                        }
                    }
                    else if (el.hasClass('location-detail')) {
                        new FoodParent.NavigateCommand({ hash: 'mdonation', id: options.place.getId() }).execute();
                    }
                    break;
                case VIEW_STATUS.ADD_DONATION:
                    if (el.hasClass('button-submit-donation')) {
                    }
                    else if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        if (FoodParent.View.getDetailDonationView()) {
                            FoodParent.View.getDetailDonationView().refreshDonationInfo();
                        }
                    }
                    break;
                case VIEW_STATUS.DETAIL_DONATION:
                    if (el.hasClass('content-chart')) {
                        if (options.donation) {
                            new FoodParent.RenderEditDonationViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), donation: options.donation }).execute();
                        }
                    }
                    else if (el.hasClass('button-new-donation')) {
                        if (options.place) {
                            new FoodParent.RenderAddDonationViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), place: options.place }).execute();
                        }
                    }
                    break;
                case VIEW_STATUS.EDIT_DONATION:
                    if (el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        if (FoodParent.View.getDetailDonationView()) {
                            FoodParent.View.getDetailDonationView().refreshDonationInfo();
                        }
                    }
                    else if (el.hasClass('delete-donation')) {
                    }
                    break;
                case VIEW_STATUS.LOGIN:
                    if (el.hasClass('evt-close')) {
                        new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        new FoodParent.RefreshCurrentViewCommand().execute();
                    }
                    else if (el.hasClass('evt-submit')) {
                        if (options.contact != undefined && options.password != undefined) {
                            FoodParent.Controller.processLogin(options.contact, options.password, function (response) {
                                new FoodParent.ResetPopupViewCommand().execute();
                                Backbone.history.loadUrl(Backbone.history.fragment);
                            }, function (response) {
                                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }, function (response) {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                    }
                    else if (el.hasClass('evt-logout')) {
                        FoodParent.Controller.processLogout(function () {
                            new FoodParent.ResetPopupViewCommand().execute();
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        }, function () {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    else if (el.hasClass('evt-signup')) {
                        console.log("signup button works");
                        if (FoodParent.View.getViewStatus() != VIEW_STATUS.SIGNUP) {
                            new FoodParent.RenderSignUpViewCommand({ el: FoodParent.Setting.getPopWrapperElement() }).execute();
                        }
                    }
                    break;
                case VIEW_STATUS.SIGNUP:
                    if (el.hasClass('evt-close')) {
                        new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                        new FoodParent.RefreshCurrentViewCommand().execute();
                    }
                    else if (el.hasClass('evt-submit')) {
                        FoodParent.Controller.processSignup(options.contact, options.name, options.neighborhood, function (response) {
                            new FoodParent.ResetPopupViewCommand().execute();
                            Backbone.history.loadUrl(Backbone.history.fragment);
                        }, function (response) {
                            new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                        }, function (response) {
                            EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    break;
                case VIEW_STATUS.ADOPT_TREE:
                    if (el.hasClass('evt-close')) {
                        new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }
                    else if (el.hasClass('evt-submit')) {
                        if (options.tree) {
                            FoodParent.Controller.checkIsLoggedIn(function (response) {
                                var food = FoodParent.Model.getFoods().findWhere({ id: options.tree.getFoodId() });
                                var person = FoodParent.Model.getPersons().findWhere({ id: parseInt(response.id) });
                                EventHandler.handleAdoptionData(options.tree, person, DATA_MODE.CREATE, {}, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                                    new FoodParent.RefreshCurrentViewCommand().execute();
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                }, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new FoodParent.RefreshCurrentViewCommand().execute();
                                });
                            }, function (response) {
                                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                    }
                    break;
                case VIEW_STATUS.UNADOPT_TREE:
                    if (el.hasClass('evt-close')) {
                        new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }
                    else if (el.hasClass('evt-submit')) {
                        if (options.tree) {
                            FoodParent.Controller.checkIsLoggedIn(function (response) {
                                var food = FoodParent.Model.getFoods().findWhere({ id: options.tree.getFoodId() });
                                var person = FoodParent.Model.getPersons().findWhere({ id: parseInt(response.id) });
                                EventHandler.handleAdoptionData(options.tree, person, DATA_MODE.DELETE, {}, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has unadopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new FoodParent.RemovePopupViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                                    new FoodParent.RefreshCurrentViewCommand().execute();
                                }, function () {
                                    EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                                }, function () {
                                    EventHandler.handleDataChange("<strong><i>" + person.getName() + "</i></strong> has adopted <strong><i>" + food.getName() + " " + options.tree.getName() + "</i></strong> successfully.", false);
                                    new FoodParent.RefreshCurrentViewCommand().execute();
                                });
                            }, function (response) {
                                new FoodParent.RenderMessageViewCommand({ el: FoodParent.Setting.getMessageWrapperElement(), message: FoodParent.Setting.getErrorMessage(response.code), undoable: false }).execute();
                            }, function () {
                                EventHandler.handleError(ERROR_MODE.SEVER_CONNECTION_ERROR);
                            });
                        }
                    }
                    break;
                case VIEW_STATUS.MANAGE_PEOPLE:
                    if (el.hasClass('change-password')) {
                        FoodParent.Controller.checkAdmin(function (data) {
                            if (parseInt(data.auth) != 0 && parseInt(data.auth) > options.person.getAuth()) {
                                new FoodParent.RenderMessageViewCommand({
                                    el: FoodParent.Setting.getMessageWrapperElement(), message: "You <strong>don't</strong> have privilege to change <strong>higher level</strong> of authorization.", undoable: false
                                }).execute();
                            }
                            else {
                                new FoodParent.RenderChangePasswordViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), person: options.person }).execute();
                            }
                        }, function () {
                            FoodParent.EventHandler.handleError(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                        });
                    }
                    break;
                case VIEW_STATUS.CHANGE_PASSWORD:
                    if (el.hasClass('password-cancel') || el.hasClass('button-close')) {
                        new RemoveAlertViewCommand({ delay: FoodParent.Setting.getRemovePopupDuration() }).execute();
                    }
                    break;
            }
        };
        EventHandler.handleMouseEnter = function (el, view) {
            switch (FoodParent.View.getViewStatus()) {
                case VIEW_STATUS.NONE:
                    break;
            }
        };
        EventHandler.handleError = function (errorMode, customMessage) {
            new FoodParent.RenderAlertViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), errorMode: errorMode, customMessage: customMessage }).execute();
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
                case DATA_MODE.UPDATE_COVER:
                    self._lastCommand = new FoodParent.UpdateNoteCover({ note: note, cover: args.cover }, success, error);
                    break;
                case DATA_MODE.UPDATE_DATE:
                    self._lastCommand = new FoodParent.UpdateNoteDate({ note: note, date: args.date }, success, error);
                    break;
                case DATA_MODE.ADD_PICTURE:
                    self._lastCommand = new FoodParent.AddNotePicture({ note: note, filename: args.filename }, success, error, undoSuccess);
                    break;
                case DATA_MODE.CREATE:
                    new FoodParent.CreateNote({ note: note }, success, error).execute();
                    break;
                case DATA_MODE.DELETE:
                    FoodParent.View.popViewStatus();
                    var command = new FoodParent.DeleteNote({ note: note }, success, error);
                    new FoodParent.RenderConfirmViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), message: "Are you sure to delete this note?", command: command }).execute();
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
                    self._lastCommand = new FoodParent.UpdateTreeFlag({ tree: tree, flag: args.flag, addmode: args.addmode }, success, error);
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
                case DATA_MODE.UPDATE_ADDRESS:
                    self._lastCommand = new FoodParent.UpdateTreeAddress({ tree: tree, address: args.address }, success, error);
                    break;
                case DATA_MODE.CREATE:
                    self._lastCommand = new FoodParent.AddNewTree({ tree: tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    var food = FoodParent.Model.getFoods().findWhere({ id: tree.getFoodId() });
                    var command = new FoodParent.DeleteTree({ tree: tree }, success, error);
                    new FoodParent.RenderConfirmViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), message: "Are you sure to delete '" + food.getName() + " " + tree.getName() + "' ?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        };
        EventHandler.handleAdoptionData = function (tree, person, dataMode, args, success, error, undo) {
            var self = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new FoodParent.CreateAdoption({ tree: tree, person: person }, success, error, undo);
                    break;
                case DATA_MODE.DELETE:
                    self._lastCommand = new FoodParent.DeleteAdoption({ tree: tree, person: person }, success, error, undo);
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        };
        EventHandler.handleDonationData = function (donation, dataMode, args, success, error, undoSuccess) {
            var self = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new FoodParent.CreateDonation({ donation: donation }, success, error, undoSuccess);
                    break;
                case DATA_MODE.ADD_PICTURE:
                    self._lastCommand = new FoodParent.AddDonationPicture({ donation: donation, filename: args.filename }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_COVER:
                    self._lastCommand = new FoodParent.UpdateDonationCover({ donation: donation, cover: args.cover }, success, error);
                    break;
                case DATA_MODE.UPDATE_DATE:
                    self._lastCommand = new FoodParent.UpdateDonationDate({ donation: donation, date: args.date }, success, error);
                    break;
                case DATA_MODE.ADD_DONATION_TREE:
                    self._lastCommand = new FoodParent.AddDonationTree({ donation: donation, tree: args.tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.REMOVE_DONATION_TREE:
                    self._lastCommand = new FoodParent.RemoveDonationTree({ donation: donation, tree: args.tree }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_DONATION_AMOUNT:
                    self._lastCommand = new FoodParent.UpdateDonationAmount({ donation: donation, amount: args.amount }, success, error, undoSuccess);
                    break;
                case DATA_MODE.DELETE:
                    FoodParent.View.popViewStatus();
                    var command = new FoodParent.DeleteDonation({ donation: donation }, success, error);
                    new FoodParent.RenderConfirmViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), message: "Are you sure to delete this donation?", command: command }).execute();
                    break;
            }
            if (self._lastCommand != undefined) {
                self._lastCommand.execute();
            }
        };
        EventHandler.handlePlaceData = function (place, dataMode, args, success, error, undoSuccess) {
            var self = EventHandler._instance;
            self._lastCommand = null;
            switch (dataMode) {
                case DATA_MODE.CREATE:
                    self._lastCommand = new FoodParent.CreateLocation({ place: place }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_NAME:
                    self._lastCommand = new FoodParent.UpdateLocationName({ place: place, name: args.name }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_DESCRIPTION:
                    self._lastCommand = new FoodParent.UpdateLocationDescription({ place: place, description: args.description }, success, error, undoSuccess);
                    break;
                case DATA_MODE.UPDATE_LOCATION:
                    self._lastCommand = new FoodParent.UpdateLocationLocation({ place: place, marker: args.marker, location: args.location }, success, error);
                    break;
                case DATA_MODE.UPDATE_ADDRESS:
                    self._lastCommand = new FoodParent.UpdateLocationAddress({ place: place, address: args.address }, success, error);
                    break;
                case DATA_MODE.DELETE:
                    var command = new FoodParent.DeleteLocation({ place: place }, success, error);
                    new FoodParent.RenderConfirmViewCommand({ el: FoodParent.Setting.getPopWrapperElement(), message: "Are you sure to delete this location?", command: command }).execute();
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
