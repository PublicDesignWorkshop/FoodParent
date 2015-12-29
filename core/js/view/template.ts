module FoodParent {
    export class Template {
        private static _instance: Template = new Template();
        private baseUrl: string;
        constructor(args?: any) {
            if (Template._instance) {
                throw new Error("Error: Instantiation failed: Use Template.getInstance() instead of new.");
            }
            Template._instance = this;
        }
        public static getInstance(): Template {
            return Template._instance;
        }

        public static getHomeViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-home">';
            template +=     '<div class="home-menu-left">';
            template +=         '<div class="title-left">Food</div>';
            template +=         '<div class="enter-left"><i class="fa fa-angle-left"></i> manage food assets</div>';
            template +=     '</div>';
            template +=     '<div class="home-menu-right">';
            template +=         '<div class="title-right">Parent</div>';
            template +=         '<div class="enter-left">parent food assets <i class="fa fa-angle-right"></i></div>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getManageTreesMapViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-mtrees">';
            template += '</div>';
            return template;
        }

        public static getNavViewHomeTemplate(): string {
            var template = '';
            template += '<div id="background-nav-right">';
            template += '</div>';
            template += '<div id="background-nav-left">';
            template += '</div>';
            template += '<div id="list-nav">';
            template += '</div>';
            return template;
        }

        public static getNavViewManageTemplate(): string {
            var template = '';
            template += '<div id="background-nav-right">';
            template += '</div>';
            template += '<div id="background-nav-left">';
            template += '</div>';
            template += '<div id="list-nav">';
            template += '</div>';
            return template;
        }

        public static getNavViewManageItemsTemplate(): string {
            var template = '';
            template += '<div class="item-nav item-manage-title">FoodParent&#8482;</div>';
            template += '<div class="item-nav item-manage trees">TREES</div>';
            template += '<div class="item-nav item-manage people">PEOPLE</div>';
            template += '<div class="item-nav item-manage adops">ADOPTS</div>';
            template += '<div class="item-nav item-manage donations">DONATIONS</div>';
            template += '<div class="item-nav item-manage-parent parent">PARENT</div>';
            return template;
        }

        public static getAlertViewTemplate(): string {
            var template = '';
            template += '<div id="wrapper-alert">';
            template +=     '<div class="outer-frame">';
            template +=         '<div class="inner-frame">';
            template +=             '<%= content %>';
            template +=         '</div>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }

        public static getManageTreesPopupTemplate(): string {
            var template = '';
            template += '<div class="marker-control-wrapper">';
            template +=     '<div class="marker-control-item">';
            template +=         '<i class="fa fa-lock fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item">';
            template +=         '<i class="fa fa-info fa-2x"></i>';
            template +=     '</div>';
            template +=     '<div class="marker-control-item">';
            template +=         '<i class="fa fa-remove fa-2x"></i>';
            template +=     '</div>';
            template += '</div>';
            return template;
        }
    }
}