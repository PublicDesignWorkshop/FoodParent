module FoodParent {
    export class Controller {
        private static _instance: Controller = new Controller();
        private static TAG: string = "Controller - ";
        private bDebug: boolean = true;
        private xhrPool: Array<JQueryXHR>;
        constructor(args?: any) {
            if (Controller._instance) {
                throw new Error("Error: Instantiation failed: Use Controller.getInstance() instead of new.");
            }
            Controller._instance = this;
            Controller._instance.xhrPool = new Array<JQueryXHR>();
        }
        public static getInstance(): Controller {
            return Controller._instance;
        }
        public static pushXHR(xhr: JQueryXHR) {
            var self: Controller = Controller._instance;
            self.xhrPool.push(xhr);
        }
        public static removeXHR(xhr: JQueryXHR) {
            var self: Controller = Controller._instance;
            var index = self.xhrPool.indexOf(xhr);
            if (index > -1) {
                self.xhrPool.splice(index, 1);
            }
        }
        public static abortAllXHR() {
            var self: Controller = Controller._instance;
            $.each(self.xhrPool, function (index: number, xhr: JQueryXHR) {
                if (xhr != undefined) {
                    xhr.abort();
                }
            });
            self.xhrPool = new Array<JQueryXHR>();
        }
        public static updateGeoLocation(success?: PositionCallback, error?: PositionErrorCallback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                /*  Modern browser doesn't reach since it already supports geolocation service.
                if (success) {
                    success({ coords: { accuracy: 4196, altitude: null, altitudeAccuracy: null, heading: null, latitude: 33.7946333, longitude: -84.448771, speed: null }, timestamp: new Date().valueOf() });
                }
                */
            }
        }
        public static fetchAllTrees(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllFoods();
            var xhr2: JQueryXHR = Model.fetchAllTrees();
            var xhr3: JQueryXHR = Model.fetchAllAdopts();
            var xhr4: JQueryXHR = Model.fetchAllPersons();
            var xhr5: JQueryXHR = Model.fetchAllFlags();
            var xhr6: JQueryXHR = Model.fetchAllOwnerships();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            Controller.pushXHR(xhr3);
            Controller.pushXHR(xhr4);
            Controller.pushXHR(xhr5);
            Controller.pushXHR(xhr6);
            $.when(
                xhr1, xhr2, xhr3, xhr4
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                Controller.removeXHR(xhr6);
                Model.getTrees().updateParents();
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
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }
        public static fetchAllFlagsAndOwners(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllFlags();
            var xhr2: JQueryXHR = Model.fetchAllOwnerships();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            $.when(
                xhr1, xhr2
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchAllPersonsAndAuthsAndFoodAndTreesAndAdopts(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllAuths();
            var xhr2: JQueryXHR = Model.fetchAllPersons();
            var xhr3: JQueryXHR = Model.fetchAllAdopts();
            var xhr4: JQueryXHR = Model.fetchAllTrees();
            var xhr5: JQueryXHR = Model.fetchAllFoods();
            Controller.pushXHR(xhr1);
            Controller.pushXHR(xhr2);
            Controller.pushXHR(xhr3);
            Controller.pushXHR(xhr4);
            Controller.pushXHR(xhr5);
            $.when(
                xhr1, xhr2, xhr3, xhr4, xhr5
            ).then(function () {
                Controller.removeXHR(xhr1);
                Controller.removeXHR(xhr2);
                Controller.removeXHR(xhr3);
                Controller.removeXHR(xhr4);
                Controller.removeXHR(xhr5);
                Model.getPersons().updateTrees();
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
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchAllPersons(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllPersons();
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchAllFoods(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllFoods();
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchImageNotesOfTreesDuringPeriod(trees: Array<Tree>, startDate: string, endDate: string, size: number, offset: number, success?: any, error?: any) {
            var ids: Array<number> = new Array<number>();
            $.each(trees, function (index: number, tree: Tree) {
                ids.push(tree.getId());
            });
            var xhr1: JQueryXHR = Model.fetchImageNotesOfTreesDuringPeriod(ids, startDate, endDate, size, offset);
            //var xhr1: JQueryXHR = Model.fetchImageNotesOfTreesDuringPeriod(ids, moment(new Date()).subtract(2, 'years').startOf('day').format(Setting.getDateTimeFormat()), endDate, size, offset);
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchNotesOfTrees(trees: Array<Tree>, type: NoteType, size: number, offset: number, success?: any, error?: any) {
            var ids: Array<number> = new Array<number>();
            $.each(trees, function (index: number, tree: Tree) {
                ids.push(tree.getId());
            });
            var xhr1: JQueryXHR = Model.fetchNotesOfTrees(ids, type, size, offset);
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static uploadNotePictureFile(file: any, foodname: string, success?: Function, error?: Function) {
            // Create a formdata object and add the files
            var data = new FormData();
            data.append("filename", file);

            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getFileUploadPath() + "?foodname=" + htmlEncode(foodname) + "&files",
                type: "POST",
                data: data,
                cache: false,
                dataType: "json",
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data.files[0].replace(Setting.getRelativeFileUploadPath(), ""));
                        }
                    } else {
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
        }

        public static fetchAllLocations(success?: any, error?: any) {
            var xhr1: JQueryXHR = Model.fetchAllPlaces();
            var xhr2: JQueryXHR = Model.fetchAllTrees();
            var xhr3: JQueryXHR = Model.fetchAllFoods();
            $.when(
                xhr1, xhr2, xhr3
            ).then(function () {
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
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchDonationsOfPlaces(places: Array<Place>, size: number, offset: number, success?: any, error?: any) {
            var ids: Array<number> = new Array<number>();
            $.each(places, function (index: number, place: Place) {
                ids.push(place.getId());
            });
            var xhr1: JQueryXHR = Model.fetchDonationsOfPlaces(ids, size, offset);
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static fetchDonationsOfPlacesDuringPeriod(places: Array<Place>, startDate: string, endDate: string, size: number, offset: number, success?: any, error?: any) {
            var ids: Array<number> = new Array<number>();
            $.each(places, function (index: number, place: Place) {
                ids.push(place.getId());
            });
            var xhr1: JQueryXHR = Model.fetchDonationsOfPlacesDuringPeriod(ids, startDate, endDate, size, offset);
            Controller.pushXHR(xhr1);
            $.when(
                xhr1
            ).then(function () {
                Controller.removeXHR(xhr1);
                if (success) {
                    success();
                }
            }, function () {
                Controller.removeXHR(xhr1);
                if (error) {
                    error(ERROR_MODE.SEVER_CONNECTION_ERROR);
                }
            });
        }

        public static checkIsAdmin(success?: any, fail?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "admincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (response, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (parseInt(response.code) == 400) {   // Is admin
                        if (success) {
                            success(response);
                        }
                    } else {   // Is not admin
                        if (fail) {
                            fail(response);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR);       // TODO: handle error message from php retrn code
                    }
                }
            });
            Controller.pushXHR(xhr1);
        }

        public static checkIsLoggedIn(success?: any, fail?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "logincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (response, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (parseInt(response.code) == 400) {   // Logged in
                        if (success) {
                            success(response);
                        }
                    } else {   // Not logged in
                        if (fail) {
                            fail(response);
                        }
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    Controller.removeXHR(xhr1);
                    if (error) {
                        error(jqXHR);       // TODO: handle error message from php retrn code
                    }
                }
            });
            Controller.pushXHR(xhr1);
        }

        public static checkLogin(success?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "logincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data);
                            //success(data.files[0].replace(Setting.getRelativeFileUploadPath(), ""));
                        }
                    } else {
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
        }

        public static checkAdmin(success?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "admincheck.php",
                type: "POST",
                data: {},
                cache: false,
                dataType: "json",
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (data, textStatus, jqXHR) {
                    Controller.removeXHR(xhr1);
                    if (typeof data.error === "undefined") {
                        if (success) {
                            success(data);
                            //success(data.files[0].replace(Setting.getRelativeFileUploadPath(), ""));
                        }
                    } else {
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
        }

        public static processLogin(contact: string, password: string, success?: any, fail?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "login.php",
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
                    } else {
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
        }

        public static processLogout(success?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "logout.php",
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
                    } else {
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
        }

        public static processSignup(contact: string, name: string, neighborhood: string, success?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "signup.php",
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
                            //success(data.files[0].replace(Setting.getRelativeFileUploadPath(), ""));
                        }
                    } else {
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
        }

        public static changePassword(id: number, password: string, success?: any, error?: any) {
            var xhr1: JQueryXHR = $.ajax({
                url: Setting.getPhpDir() + "password.php",
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
                            //success(data.files[0].replace(Setting.getRelativeFileUploadPath(), ""));
                        }
                    } else {
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
        }
    }

    export class Router extends Backbone.Router {
        private static _instance: Router = new Router();
        private static TAG: string = "Router - ";
        constructor(options?: Backbone.RouterOptions) {
            if (Router._instance) {
                throw new Error("Error: Instantiation failed: Use Router.getInstance() instead of new.");
            }
            Router._instance = this;
            // Setup Router parameters
            this.routes = {
                "": "home",
                "trees/:id": "trees",
                "mtree/:id": "manageTree",
                "mpeople/:id": "managePeople",
                "mdonations/:id": "manageDonations",
                "mdonation/:id": "manageDonation",
            }
            super(options);
        }
        public static getInstance(): Router {
            return Router._instance;
        }
        home() {
            EventHandler.handleNavigate(VIEW_STATUS.HOME);
        }
        trees(id: number) {
            EventHandler.handleNavigate(VIEW_STATUS.TREES, { id: id });
        }
        manageTree(id: number) {
            EventHandler.handleNavigate(VIEW_STATUS.DETAIL_TREE, { id: id });
        }
        managePeople(id: number) {
            EventHandler.handleNavigate(VIEW_STATUS.MANAGE_PEOPLE, { id: id });
        }
        manageDonations(id: number) {
            EventHandler.handleNavigate(VIEW_STATUS.MANAGE_DONATIONS, { id: id });
        }
        manageDonation(id: number) {
            EventHandler.handleNavigate(VIEW_STATUS.DETAIL_DONATION, { id: id });
        }
    }
} 