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

        public getMainTreeViewTemplate(): string {
            var template = "";
            template += '<div class="col-xs-3 panel-body">';
            template +=     '<div class="panel-tree-info"></div>';
            template +=     '<div id="map-tree" class="panel-tree-map"></div>';
            template += '</div>';
            template +=     '<div class="col-xs-9 panel-body">';
            template +=         '<div class="panel-breadcrumb"></div>';
            template +=         '<div class="panel-tree-coverflow"></div>';
            template +=         '<div class="panel-tree-detail"></div>';
            template += '</div>';
            return template;
        }

        public getMainTreesViewTemplate(): string {
            var template = "";
            //template += '<div class="row panel-body">';
            template += '<div id="map-trees" class="col-xs-9 panel-body panel-map"></div>';
            template += '<div class="col-xs-3 panel-body panel-sideinfo"></div>';
            //template += '</div>';
            return template;
        }

        public getEmptySideInfoViewTemplate(): string {
            var template = "";
            template += '<div class="form-group">';
            template += '<div class="col-xs-12 left"><input type="checkbox" checked id="toggle-table"></div>';
            template += '</div>';
            return template;
        }

        public getSideInfoViewTemplate(): string {
            var template = "";

            template += '<div class="form-group">';
            template += '<div class="col-xs-12 left"><input type="checkbox" checked id="toggle-table"></div>';
            template += '</div>';

            template += '<div class="col-xs-12 panel-sideinfo"><h1><%= name %></h1></div>';
            template += '<div class="col-xs-12 panel-sideinfo"><%= location %></div>';
            template += '<div class="clear" />';
            
            // flags
            template += '<div class="form-group split">';
            template += '<div class="col-xs-3 split-rect"></div>';
            template += '<div class="col-xs-9 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <%= flag %></h2></div>';
            template += '<div class="form-group">';
            template += '<% _.each(flags.models, function (flag) { %>';
            template +=     '<div class="col-xs-6 group-radio">';
            template +=         '<label class="label-radio"><input type="radio" class="flag-radio" data-flag="<%= flag.getId() %>">&nbsp <%= flag.getName() %></label>';
            template +=     '</div>';
            template += '<% }); %>';
            template += '</div>';
            
            // type
            template += '<div class="form-group split">';
            template += '<div class="col-xs-4 split-rect"></div>';
            template += '<div class="col-xs-8 split-label"></div>';
            template += '<div class="clear" />';
            
            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span> <%= type %></h2></div>';
            template += '<div class="form-group">';
            template += '<% _.each(types.models, function (type) { %>';
            template += '<div class="col-xs-6 group-radio">';
            template += '<label class="label-radio"><input type="radio" class="type-radio" data-type="<%= type.getId() %>">&nbsp <%= type.getName() %></label>';
            template += '</div>';
            template += '<% }); %>';
            template += '</div>';

            // recent
            template += '<div class="form-group split">';
            template += '<div class="col-xs-5 split-rect"></div>';
            template += '<div class="col-xs-7 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12 panel-sideinfo"><h2><span class="glyphicon glyphicon-time" aria-hidden="true"></span> <%= recent %></h2></div>';
            
            return template;
        }

        public getMapPopupTemplate(): string {
            var template = "";
            template += '<%= name %>&nbsp&nbsp<span class="glyphicon glyphicon-log-in" aria-hidden="true" data-id="<%= id %>"></span>&nbsp';
            return template;
        }

        public getSmallMapPopupTemplate(): string {
            var template = "";
            template += '<span data-id="<%= id %>"><%= name %></span>';
            return template;
        }

        public getTreeInfoViewTemplate(): string {
            var template = "";
            //template += '<div class="row panel-body">';
            template += '<div class="col-xs-12"><h1><%= name %></h1></div>';
            template += '<div class="col-xs-12"><%= location %></div>';
            template += '<div class="clear" />';

            // circle-progress
            template += '<div class="form-group">';
            template +=     '<div class="col-xs-3 circle-progress-left"><div><%= ripening %></div><div><%= ratio %></div></div>';
            template +=     '<div class="col-xs-6">';
            template +=         '<div id="ripen-progress" class="circle-progress"></div>';
            template +=     '</div>';
            template +=     '<div class="col-xs-3 circle-progress-right"><div><%= approximate %></div><div><%= food %></div></div>';
            template += '</div>';
            template += '<div class="clear" />';
            
            // flags
            template += '<div class="form-group split">';
            template += '<div class="col-xs-3 split-rect"></div>';
            template += '<div class="col-xs-9 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12"><h2><span class="glyphicon glyphicon-flag" aria-hidden="true"></span> <%= flag %></h2></div>';
            template += '<div class="form-group">';
            template += '<% _.each(flags.models, function (flag) { %>';
            template += '<div class="col-xs-6 group-radio">';
            template += '<label class="label-radio"><input type="radio" class="flag-radio" data-flag="<%= flag.getId() %>">&nbsp <%= flag.getName() %></label>';
            template += '</div>';
            template += '<% }); %>';
            template += '</div>';
            
            // type
            template += '<div class="form-group split">';
            template += '<div class="col-xs-4 split-rect"></div>';
            template += '<div class="col-xs-8 split-label"></div>';
            template += '<div class="clear" />';

            template += '<div class="col-xs-12"><h2><span class="glyphicon glyphicon-bookmark" aria-hidden="true"></span> <%= type %></h2></div>';
            template += '<div class="form-group">';
            template += '<% _.each(types.models, function (type) { %>';
            template += '<div class="col-xs-6 group-radio">';
            template += '<label class="label-radio"><input type="radio" class="type-radio" data-type="<%= type.getId() %>">&nbsp <%= type.getName() %></label>';
            template += '</div>';
            template += '<% }); %>';
            template += '</div>';

            return template;
        }

        public getCoverflowTemplate(): string {
            var template = "";
            template += '<div class="wrapper-coverflow">';
            template +=     '<div id="coverflow">';
            template +=     '<% _.each(notes, function (note) { %>';
            template +=         '<img src="<%= note.getPicturePath() %>" data-id="<%= note.getId() %>" />';
            template +=     '<% }); %>';
            template +=     '</div>';
            template += '</div>';
            template += '<div class="label-coverflow">';
            template += '</div>';
            return template;
        }

        public getLocationTableTemplate(): string {
            var template = "";
            template += '<div class="list">';

            template += '<div class="col-xs-12"><h1><%= title %></h1></div>';
            template += '<div class="clear" />';

            // circle-progress
            template += '<div class="form-group">';
            template += '<div class="col-xs-12">';
            template +=     '<div class="list-location"></div>';
            template += '</div>';
            template += '<div class="clear" />';


            template += '</div>';

            return template;
        }
    }
}