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
        private static getIsMobile(): boolean {
            var self: Setting = Setting._instance;
            var bMobile = false; //initiate as false
            // device detection
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
                || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
                bMobile = true;
            }
            return bMobile;
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
        public static getFilterAnimDuration(): number {
            return 250;
        }
        public static getRemovePopupDuration(): number {
            return 100;
        }
        public static getDefaultMapZoomLevel(): number {
            return 12;
        }
        public static getTileMapAddress(): string {
            return '//{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
            //return 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg'
            //return 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        }
        public static getReverseGeoCodingAddress(coordinate: L.LatLng): string {
            return '//nominatim.openstreetmap.org/reverse?format=json&lat=' + coordinate.lat + '&lon=' + coordinate.lng + '&zoom=18&addressdetails=1';
        }
        public static getMapMinZoomLevel(): number {
            return 5;
        }
        public static getMapMaxZoomLevel(): number {
            return 19;
        }
        public static getMapCenterZoomLevel(): number {
            return 15;
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
            return 20;
        }
        public static getNoDataText(): string {
            return "No Data";
        }
        public static getMaxRating(): number {
            return 10
        }

        public static getResizeTimeout(): number {
            return 50;
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
                case 400:
                    return "No error occured.";
                    break;
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
                case 902:
                    return "You need to sign in as <strong>admin</strong> to perform this action.";
                    break;
            }
            return "";
        }
    }
}
