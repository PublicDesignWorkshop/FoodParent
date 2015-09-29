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

        public getBaseTemplate(): string {
            var template = "";
            template += '<div id="wrapper-main-body"></div>';
            template += '<div id="wrapper-main-header"></div>';
            return template;
        }

        public getMainHeaderTemplate(): string {
            var template = "";
            template += '<div class="row">';
            template +=     '<div class="col-xs-3 btn-nav nav-home"><%= site %></div>';
            template +=     '<div class="col-xs-3 btn-nav nav-trees"><%= trees %></div>';
            template +=     '<div class="col-xs-3 btn-nav nav-note"><%= note %></div>';
            template +=     '<div class="col-xs-3 btn-nav nav-about"><%= about %></div>';
            template += '</div>';
            return template;
        }

        public getMainTreesViewTemplate(): string {
            var template = "";
            //template += '<div class="row panel-body">';
            template +=     '<div id="map-trees" class="col-xs-8 panel-body panel-map"></div>';
            template +=     '<div class="col-xs-4 panel-body panel-sideinfo"></div>';
            //template += '</div>';
            return template;
        }
    }
}