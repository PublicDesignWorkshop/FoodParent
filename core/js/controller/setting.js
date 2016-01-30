var FoodParent;
(function (FoodParent) {
    var Setting = (function () {
        function Setting(args) {
            if (Setting._instance) {
                throw new Error("Error: Instantiation failed: Use Setting.getInstance() instead of new.");
            }
            Setting._instance = this;
        }
        Setting.getInstance = function () {
            return Setting._instance;
        };
        Setting.setBaseUrl = function (url) {
            return Setting._instance._baseUrl = url;
        };
        Setting.getBaseUrl = function () {
            return Setting._instance._baseUrl;
        };
        Setting.getPhpDir = function () {
            return Setting._instance._baseUrl + "core/php/";
        };
        Setting.getContentPictureDir = function () {
            return Setting._instance._baseUrl + "content/picture/";
        };
        Setting.getContentIconDir = function () {
            return Setting._instance._baseUrl + "content/icon/";
        };
        Setting.getCoreImageDir = function () {
            return Setting._instance._baseUrl + "core/image/";
        };
        Setting.getMarkerShadowPath = function () {
            return Setting.getCoreImageDir() + "marker-shadow.png";
        };
        Setting.getBlankImagePath = function () {
            return Setting.getCoreImageDir() + "picture-blank.jpg";
        };
        Setting.getFileUploadPath = function () {
            return Setting.getPhpDir() + "upload.php";
        };
        Setting.getRelativeFileUploadPath = function () {
            return "../../content/picture/";
        };
        Setting.getNavWrapperElement = function () {
            return $('#wrapper-nav');
        };
        Setting.getMainWrapperElement = function () {
            return $('#wrapper-main');
        };
        Setting.getPopWrapperElement = function () {
            return $('#wrapper-pop');
        };
        Setting.getMessageWrapperElement = function () {
            return $('#wrapper-message');
        };
        Setting.getNavAnimDuration = function () {
            return 100;
        };
        Setting.getRemovePopupDuration = function () {
            return 250;
        };
        Setting.getDefaultMapZoomLevel = function () {
            return 12;
        };
        Setting.getTileMapAddress = function () {
            return 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
            //return 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            //return 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        };
        Setting.getReverseGeoCodingAddress = function (coordinate) {
            return 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + coordinate.lat + '&lon=' + coordinate.lng + '&zoom=18&addressdetails=1';
        };
        Setting.getMapMinZoomLevel = function () {
            return 5;
        };
        Setting.getMapMaxZoomLevel = function () {
            return 19;
        };
        Setting.getMapCenterZoomLevel = function () {
            return 16;
        };
        Setting.getDateForDatePicker = function () {
            return "YYYY/MM/DD";
        };
        Setting.getDateFormat = function () {
            return "DD MMM YYYY";
        };
        Setting.getDateFormat2 = function () {
            return "Do MMM YYYY";
        };
        Setting.getDateTimeFormat = function () {
            return "YYYY-MM-DD HH:mm:ss";
        };
        Setting.getDateHourFormat = function () {
            return "ha ddd Do MMM YYYY";
        };
        Setting.getDevContact = function () {
            return "captainwhale52@gmail.com";
        };
        Setting.getManagerContact = function () {
            return "captainwhale52@gmail.com";
        };
        Setting.getNumRecentActivitiesShown = function () {
            return 5;
        };
        Setting.getLargeNumRecentActivitiesShown = function () {
            return 10;
        };
        Setting.getNoDataText = function () {
            return "No Data";
        };
        Setting.getMaxRating = function () {
            return 10;
        };
        /*

        Server Error Code

        404: Connection Error
        
        604: Missing name field
        605: Missing neiborhood field

        803: Not Valid Email Address
        804: User existing Error
        805: Wrong Login Parameters
        
        901: Not Logged In Error


        */
        Setting.getErrorMessage = function (code) {
            switch (parseInt(code)) {
                case 404:
                    return "Server connection error occured.";
                    break;
                case 604:
                    return "Please enter your <strong>first and last name</strong>.";
                    break;
                case 605:
                    return "Please enter a <strong>name of location</strong> near you live.";
                case 803:
                    return "Please put a <strong>valid e-mail address</strong>.";
                    break;
                case 804:
                    return "The <strong>e-mail address</strong> that you entered <strong>already exists</strong>.<br>Please selecting <strong>'PARENT IN'</strong> menu to sign in.";
                    break;
                case 805:
                    return "You have entered an <strong>incorrect username or password</strong>.";
                    break;
                case 901:
                    return "You need to sign in first by selecting <strong>'PARENT IN'</strong> menu.";
                    break;
            }
            return "";
        };
        Setting._instance = new Setting();
        return Setting;
    })();
    FoodParent.Setting = Setting;
})(FoodParent || (FoodParent = {}));
