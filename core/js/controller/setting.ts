module FoodParent {
    export class Setting {
        private static _instance: Setting = new Setting();
        private _baseUrl: string;
        constructor(args?: any) {
            if (Setting._instance) {
                throw new Error("Error: Instantiation failed: Use Setting.getInstance() instead of new.");
            }
            Setting._instance = this;
        }
        public static getInstance(): Setting {
            return Setting._instance;
        }
        public static setBaseUrl(url: string) {
            return Setting._instance._baseUrl = url;
        }
        public static getBaseUrl(): string {
            return Setting._instance._baseUrl;
        }
        public static getPhpDir(): string {
            return Setting._instance._baseUrl + "core/php/";
        }
        public static getContentPictureDir(): string {
            return Setting._instance._baseUrl + "content/picture/";
        }
        public static getContentIconDir(): string {
            return Setting._instance._baseUrl + "content/icon/";
        }
        public static getCoreImageDir(): string {
            return Setting._instance._baseUrl + "core/image/";
        }
        public static getMarkerShadowPath(): string {
            return Setting.getCoreImageDir() + "marker-shadow.png";
        }
        public static getBlankImagePath(): string {
            return Setting.getCoreImageDir() + "picture-blank.jpg";
        }
        public static getFileUploadPath(): string {
            return Setting.getPhpDir() + "upload.php";
        }
        public static getRelativeFileUploadPath(): string {
            return "../../content/picture/";
        }
        public static getNavWrapperElement(): JQuery {
            return $('#wrapper-nav');
        }
        public static getMainWrapperElement(): JQuery {
            return $('#wrapper-main');
        }
        public static getPopWrapperElement(): JQuery {
            return $('#wrapper-pop');
        }
        public static getMessageWrapperElement(): JQuery {
            return $('#wrapper-message');
        }
        public static getNavAnimDuration(): number {
            return 100;
        }
        public static getRemovePopupDuration(): number {
            return 250;
        }
        public static getDefaultMapZoomLevel(): number {
            return 12;
        }
        public static getTileMapAddress(): string {
            return 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
            //return 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            //return 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }
        public static getReverseGeoCodingAddress(coordinate: L.LatLng): string {
            return 'http://nominatim.openstreetmap.org/reverse?format=json&lat=' + coordinate.lat + '&lon=' + coordinate.lng + '&zoom=18&addressdetails=1';
        }
        public static getMapMinZoomLevel(): number {
            return 5;
        }
        public static getMapMaxZoomLevel(): number {
            return 19;
        }
        public static getMapCenterZoomLevel(): number {
            return 16;
        }
        public static getDateForDatePicker(): string {
            return "YYYY/MM/DD";
        }
        public static getDateFormat(): string {
            return "DD MMM YYYY";
        }
        public static getDateFormat2(): string {
            return "Do MMM YYYY";
        }
        public static getDateTimeFormat(): string {
            return "YYYY-MM-DD HH:mm:ss";
        }
        public static getDateHourFormat(): string {
            return "ha ddd Do MMM YYYY";
        }
        public static getDevContact(): string {
            return "captainwhale52@gmail.com";
        }
        public static getManagerContact(): string {
            return "captainwhale52@gmail.com";
        }
        public static getNumRecentActivitiesShown(): number {
            return 5;
        }
        public static getLargeNumRecentActivitiesShown(): number {
            return 10;
        }
        public static getNoDataText(): string {
            return "No Data";
        }
        public static getMaxRating(): number {
            return 10
        }

        public static getLogoSplashDefaultImage(): string {
            return Setting.getCoreImageDir() + "logo-splash-default.png";
        }
        public static getLogoSplashMouseOverImage(): string {
            return Setting.getCoreImageDir() + "logo-splash-mouseover.png";
        }
        public static getApplicationDescription(): string {
            return "Manage, parent, and care food assets";
        }

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

        public static getErrorMessage(code: any): string {
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
        }
    }
}