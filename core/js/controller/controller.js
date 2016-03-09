var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FoodParent;
(function (FoodParent) {
    var Controller = (function () {
        function Controller(args) {
            this.bDebug = true;
            if (Controller._instance) {
                throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
            }
            Controller._instance = this;
            Controller._instance.xhrPool = new Array();
        }
        Controller.getInstance = function () {
            return Controller._instance;
        };
        Controller.pushXHR = function (xhr) {
            var self = Controller._instance;
            self.xhrPool.push(xhr);
        };
        Controller.removeXHR = function (xhr) {
            var self = Controller._instance;
            var index = self.xhrPool.indexOf(xhr);
            if (index > -1) {
                self.xhrPool.splice(index, 1);
            }
        };
        Controller.abortAllXHR = function () {
            var self = Controller._instance;
            $.each(self.xhrPool, function (index, xhr) {
                if (xhr != undefined) {
                    xhr.abort();
                }
            });
            self.xhrPool = new Array();
        };
        Controller.updateGeoLocation = function (success, error) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            }
            else {
            }
        };
        Controller.fetchAllTrees = function (success, error) {
            var xhr1 = FoodParent.Model.fetchAllFoods();
            var xhr2 = FoodParent.Model.fetchAllTrees();
            var xhr3 = FoodParent.Model.fetchAllAdopts();
            var xhr4 = FoodParent.Model.fetchAllPersons();
            var xhr5 = FoodParent.Model.fetchAllFlags();
            var xhr6 = FoodParent.Model.fetchAllOwnerships();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            Controller.pushXHR(xhr3);
            Controller.pushXHR(xhr4);
            Controller.pushXHR(xhr5);
            Controller.pushXHR(xhr6);
            $.when(xhr1, xhr2, xhr3, xhr4).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                Controller.removeXHR(xhr6);
                FoodParent.Model.getTrees().updateParents();
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                Controller.removeXHR(xhr6);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchAllFlagsAndOwners = function (success, error) {
            var xhr1 = FoodParent.Model.fetchAllFlags();
            var xhr2 = FoodParent.Model.fetchAllOwnerships();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            $.when(xhr1, xhr2).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts = function (success, error) {
            var xhr1 = FoodParent.Model.fetchAllAuths();
            var xhr2 = FoodParent.Model.fetchAllPersons();
            var xhr3 = FoodParent.Model.fetchAllAdopts();
            var xhr4 = FoodParent.Model.fetchAllTrees();
            var xhr5 = FoodParent.Model.fetchAllFoods();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            Controller.pushXHR(xhr3);
            Controller.pushXHR(xhr4);
            Controller.pushXHR(xhr5);
            $.when(xhr1, xhr2, xhr3, xhr4, xhr5).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                FoodParent.Model.getPersons().updateTrees();
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchAllPersons = function (success, error) {
            var xhr1 = FoodParent.Model.fetchAllPersons();
            Controller.pushXHR(xhr1);
            $.when(xhr1).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchImageNotesOfTreesDuringPeriod = function (trees, startDate, endDate, size, offset, success, error) {
            var ids = new Array();
            $.each(trees, function (index, tree) {
                ids.push(tree.getId());
            });
            var xhr1 = FoodParent.Model.fetchImageNotesOfTreesDuringPeriod(ids, startDate, endDate, size, offset);
            //var xhr1: JQueryXHR = Model.fetchImageNotesOfTreesDuringPeriod(ids, moment(new Date()).subtract(2, 'years').startOf('day').format(Setting.getDateTimeFormat()), endDate, size, offset);
            Controller.pushXHR(xhr1);
            $.when(xhr1).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchNotesOfTrees = function (trees, type, size, offset, success, error) {
            var ids = new Array();
            $.each(trees, function (index, tree) {
                ids.push(tree.getId());
            });
            var xhr1 = FoodParent.Model.fetchNotesOfTrees(ids, type, size, offset);
            Controller.pushXHR(xhr1);
            $.when(xhr1).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.uploadNotePictureFile = function (file, foodname, success, error) {
            // Create a formdata object and add the files
            var data = new FormData();
            data.append("filename", file);
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getFileUploadPath() + "?foodname=" + htmlEncode(foodname) + "&files",
                type: "POST",
                data: data,
                cache: false,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data.files[0].replace(FoodParent.Setting.getRelativeFileUploadPath(), ""));
                        }
                    }
                    else {
                        if (error) {
                            error();
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error();
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.fetchAllLocations = function (success, error) {
            var xhr1 = FoodParent.Model.fetchAllPlaces();
            var xhr2 = FoodParent.Model.fetchAllTrees();
            var xhr3 = FoodParent.Model.fetchAllFoods();
            $.when(xhr1, xhr2, xhr3).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchDonationsOfPlaces = function (places, size, offset, success, error) {
            var ids = new Array();
            $.each(places, function (index, place) {
                ids.push(place.getId());
            });
            var xhr1 = FoodParent.Model.fetchDonationsOfPlaces(ids, size, offset);
            Controller.pushXHR(xhr1);
            $.when(xhr1).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.fetchDonationsOfPlacesDuringPeriod = function (places, startDate, endDate, size, offset, success, error) {
            var ids = new Array();
            $.each(places, function (index, place) {
                ids.push(place.getId());
            });
            var xhr1 = FoodParent.Model.fetchDonationsOfPlacesDuringPeriod(ids, startDate, endDate, size, offset);
            Controller.pushXHR(xhr1);
            $.when(xhr1).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(FoodParent.ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        };
        Controller.checkIsAdmin = function (success, fail, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "admincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (response, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof response.error === "undefined") {
                        if (response.result == true || response.result == 'true') {
                            if (success) {
                                success(response);
                            }
                        }
                        else if (response.result == false || response.result == 'false') {
                            if (fail) {
                                fail(response);
                            }
                        }
                    }
                    else {
                        if (error) {
                            error(response); // TODO: need to pass error code if error happens
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR); // TODO: handle error message from php retrn code
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.checkIsLoggedIn = function (success, fail, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "logincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (response, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (parseInt(response.code) == 400) {
                        if (success) {
                            success(response);
                        }
                    }
                    else {
                        if (fail) {
                            fail(response);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR); // TODO: handle error message from php retrn code
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.checkLogin = function (success, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "logincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data);
                        }
                    }
                    else {
                        if (error) {
                            error(data);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.checkAdmin = function (success, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "admincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false,
                contentType: false,
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data);
                        }
                    }
                    else {
                        if (error) {
                            error();
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error();
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.processLogin = function (contact, password, success, fail, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "login.php",
                type: "POST",
                data: {
                    'contact': contact,
                    'p': password,
                },
                cache: false,
                dataType: "json",
                success: function (response, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (parseInt(response.code) == 400) {
                        if (success) {
                            success(response);
                        }
                    }
                    else {
                        if (fail) {
                            fail(response);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.processLogout = function (success, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "logout.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                success: function (response, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (parseInt(response.code) == 400) {
                        if (success) {
                            success(response);
                        }
                    }
                    else {
                        if (error) {
                            error(response);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.processSignup = function (contact, name, neighborhood, success, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "signup.php",
                type: "POST",
                data: {
                    'contact': contact,
                    'name': name,
                    'neighborhood': neighborhood,
                },
                cache: false,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    console.log(data);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data);
                        }
                    }
                    else {
                        if (error) {
                            error(data);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller.changePassword = function (id, password, success, error) {
            var xhr1 = $.ajax({
                url: FoodParent.Setting.getPhpDir() + "password.php",
                type: "POST",
                data: {
                    'id': id,
                    'password': password,
                },
                cache: false,
                dataType: "json",
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    console.log(data);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data);
                        }
                    }
                    else {
                        if (error) {
                            error(data);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR);
                    }
                }
            });
            Controller.pushXHR(xhr1);
        };
        Controller._instance = new Controller();
        Controller.TAG = "Controller - ";
        return Controller;
    })();
    FoodParent.Controller = Controller;
    var Router = (function (_super) {
        __extends(Router, _super);
        function Router(options) {
            if (Router._instance) {
                throw new Error("Error: Instantiation failed: Use Router.getInstance() instead of new.");
            }
            Router._instance = this;
            // Setup Router parameters
            this.routes = {
                "": "home",
                "trees/:viewMode/:id": "trees",
                "mtree/:viewMode/:id": "manageTree",
                "mpeople/:viewMode/:id": "managePeople",
                "mdonations/:viewMode/:id": "manageDonations",
                "mdonation/:viewMode/:id": "manageDonation",
                "ptrees": "parentTrees",
            };
            _super.call(this, options);
        }
        Router.getInstance = function () {
            return Router._instance;
        };
        Router.prototype.home = function () {
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.HOME);
        };
        Router.prototype.trees = function (viewMode, id) {
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.TREES, { viewMode: viewMode, id: id });
        };
        Router.prototype.manageTree = function (viewMode, id) {
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.DETAIL_TREE, { viewMode: viewMode, id: id });
        };
        Router.prototype.managePeople = function (viewMode, id) {
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.MANAGE_PEOPLE, { viewMode: viewMode, id: id });
        };
        Router.prototype.manageDonations = function (viewMode, id) {
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.MANAGE_DONATIONS, { viewMode: viewMode, id: id });
        };
        Router.prototype.manageDonation = function (viewMode, id) {
            FoodParent.EventHandler.handleNavigate(FoodParent.VIEW_STATUS.DETAIL_DONATION, { viewMode: viewMode, id: id });
        };
        Router._instance = new Router();
        Router.TAG = "Router - ";
        return Router;
    })(Backbone.Router);
    FoodParent.Router = Router;
})(FoodParent || (FoodParent = {}));
