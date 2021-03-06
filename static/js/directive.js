mainModule.directive('navDirective', function () {
    return {
        restrict : 'AE',
        replace : true,
        templateUrl : 'tpls/nav.html'
    };
});

mainModule.directive('dialogFile', function () {
    return {
        restrict : 'AE',
        replace : true,
        //templateUrl : 'tpls/dialog_file.html'
    };
});

mainModule.directive('configDirective', function () {
    return {
        restrict : 'AE',
        replace : true,
        templateUrl : 'tpls/config.html',
        link : function (scope, element, attrs) {
            scope.$watch('currentComponent', function(newValue, oldValue) {
                if(scope.currentComponent == null){ 
                    
                    
                    $("#page_backgroundColor").spectrum({
                        preferredFormat: "hex",
                        showInput: true,
                        showPalette: true,
                        palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)"]],
                        change: function(color) { //console.log(color);
                            scope.currentPage.style["background-color"] = color.toHexString(); 
                            scope.$apply();
                        },
                        show: function() {

                        },
                        hide: function() {

                        }
                    });

                }else{
                    

                }
                
                //$("#borderRadius", element).val(borderRadius);
            }); 
        }
    };
});

mainModule.directive('previewDirective', function () {
    return {
        restrict : 'AE',
        replace : true,
        templateUrl : 'tpls/preview.html',
        link : function (scope, element, attrs) {
            //angular.bootstrap(element);
            
        }

    };
});

mainModule.directive('editorDirective',[ '$rootScope', function (rootScope) {
    return {
        restrict : 'AE',
        replace : true,
        templateUrl : 'tpls/editor.html',
        link : function (scope, element, attrs) {
            rootScope.originWidth = 640;
            rootScope.originHeight = 1040;
            rootScope.originScale = 1;

            rootScope.editorWidth = 384;
            rootScope.editorHeight = 624;
            rootScope.editorScale = 0.6;

            var tempHeight = $(document).height() - 120 - 40;

            if (tempHeight < rootScope.editorHeight) {
                rootScope.editorScale = tempHeight / rootScope.originHeight;
                rootScope.editorWidth = rootScope.originWidth * rootScope.editorScale;
                rootScope.editorHeight = rootScope.originHeight * rootScope.editorScale;
            }

            $(".m-editor", element).on('click', function(){
                scope.currentComponent = null;
                $(".c-c-container").removeClass("u-comChoose");
                scope.$apply();
            });

            $("#editorFrame")
                .css("font-size",  rootScope.editorScale + "rem")
                .css("margin-left", -rootScope.editorWidth / 2)
                .css("margin-top", -rootScope.editorHeight / 2 - 20)
                .css("width", rootScope.editorWidth)
                .css("height", rootScope.editorHeight);
        }
    };
}]);

mainModule.directive('audioDirective',[ '$rootScope', function (rootScope) {
    return {
        restrict : 'AE',
        replace : true,
        templateUrl : 'tpls/audio.html',
        link : function (scope, element, attrs) {
            rootScope.originWidth = 384;
            rootScope.originHeight = 624;

            rootScope.previewWidth = 80;
            rootScope.previewHeight = 418;
            rootScope.previewScale = rootScope.previewWidth / rootScope.originWidth;
        }
    };
}]);
//style="text-align: {{component.textAlign}};"color: {{component.fontColor}}; font-size: {{component.fontSize}}em; font-weight: {{component.fontWight}}; font-style: {{component.fontStyle}};text-decoration: {{component.textDecoration}};
// var tpl = [
//     '<div ng-click="setCurrentComponent(component)" class="f-abs c-c-container" ng-attr-data-id="{{component.id}}" >',
//         '<div class="">',
//             '<div class="c-externallinks content" src="../tpl/components/links/externallinks/img/layer-default.png">',
//                 '<a class="f-fix link" href="javascript:;" address="" phone="">',
//                     '<div class="btn-txt" ng-style="component.style">',
//                         '<div class="btn-info">{{component.text}}</div>',
//                     '</div>',
//                 '</a>',
//             '</div>',
//         '</div><div class="tl-c"></div><div class="tr-c"></div><div class="bl-c"></div><div class="br-c"></div>',
//     '</div>'
// ].join('');

var tpl_component_container = [
    '<div class="f-abs c-c-container" ng-click="setCurrentComponent(component)" ng-attr-data-id="{{component.id}}">',
      '<div class="">',
        '<div class="c-externallinks content" inside-styles>',
          '<a class="f-fix link" href="javascript:;" address="" phone="">',
            '<div class="btn-txt" ng-style="component.style">',
              '<div class="btn-info">{{component.text}}</div>',
            '</div>',
          '</a>',
        '</div>',
      '</div>',
      '<div class="tl-c"></div><div class="tr-c"></div><div class="bl-c"></div><div class="br-c"></div>',
    '</div>'
].join('');


mainModule.directive("componentDirective", ['$rootScope', '$compile', 'pageService', function ($rootScope, $compile, pageService) {
    return {
        restrict: "AE",
        //template: tpl_component_container,
        replace: true,
        link: function (scope, element, attrs) {
            var scale = Math.round($rootScope.editorWidth) / 640;
            $rootScope.scale = scale;
            var $component, $container = $(tpl_com_container);
            switch(scope.component.type){
                case "singleimage": 
                    $component = $compile(constants.templates.comSingleimage)(scope); 
                    scope.component.imageStyle["transform"] = "scale(" + scale + ")"; //alert(scale);
                    break;
                case "singletext": $component = $compile(constants.templates.comSingletext)(scope); break;
                case "externallinks": $component = $compile(constants.templates.comExternallinks)(scope); break;
            }
            $container.attr("data-id", scope.component.id);
            $container.prepend($component);
            element.replaceWith($container);

            $container.css("top", scope.component.top);
            $container.css("left", scope.component.left);
            $container.css("width", scope.component.width);
            $container.css("height", scope.component.height);
            $container.css("z-index", scope.component.zIndex);
            $container.css("opacity", scope.component.opacity / 100);
            $container.css("transform", "rotate(" + scope.component.rotate + "deg)");
            $container.css("display", "block");

            $("div.c-" + scope.component.type ,$container).css("background-color", scope.component.backgroundColor);
            $("div.c-" + scope.component.type ,$container).css("background-image", scope.component.backgroundImage);
            $("div.c-" + scope.component.type ,$container).css("border-width", scope.component.borderWidth);
            $("div.c-" + scope.component.type ,$container).css("border-color", scope.component.borderColor);
            $("div.c-" + scope.component.type ,$container).css("border-radius", scope.component.borderRadius);

            if(attrs.preview === '1') return;

            $container.css("top", scope.component.top * scale);
            $container.css("left", scope.component.left * scale);
            $container.css("width", scope.component.width * scale);
            $container.css("height", scope.component.height * scale);
            $container.css("z-index", scope.component.zIndex);
            $container.css("opacity",  scope.component.opacity / 100);
            $container.css("transform", "rotate(" + scope.component.rotate + "deg)");
            $container.css("display", "block");
            $container.css("cursor", "move");

            scope.$watch('currentComponent.rotate', function(newValue, oldValue) {  //console.log(newValue, oldValue);
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $container.css("transform", "rotate(" + (scope.component.rotate || 0) + "deg)");
            }); 

            scope.$watch('currentComponent.opacity', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return; //console.log($container);
                $container.css("opacity", (scope.component.opacity|| 0) / 100);
            }); 

            //console.log($("div.c-" + scope.component.type ,$container));
            //$("div.c-" + scope.component.type ,$container).css("top", scope.component.top * scale);
            //$("div.c-" + scope.component.type ,$container).css("left", scope.component.left * scale);
            //$("div.c-" + scope.component.type ,$container).css("width", scope.component.width * scale);
            //$("div.c-" + scope.component.type ,$container).css("height", scope.component.height * scale);
            $("div.c-" + scope.component.type ,$container).css("background-color", scope.component.backgroundColor);
            $("div.c-" + scope.component.type ,$container).css("background-image", scope.component.backgroundImage);
            $("div.c-" + scope.component.type ,$container).css("border-width", scope.component.borderWidth);
            $("div.c-" + scope.component.type ,$container).css("border-color", scope.component.borderColor);
            $("div.c-" + scope.component.type ,$container).css("border-radius", scope.component.borderRadius);
            //$("div.c-" + scope.component.type ,$container).css("z-index", scope.component.zIndex);
            //$("div.c-" + scope.component.type ,$container).css("opacity", scope.component.opacity / 100);
            //$("div.c-" + scope.component.type ,$container).css("transform", "rotate(" + scope.component.rotate + "deg)");
            $("div.c-" + scope.component.type ,$container).css("display", "block");
            //border-color border-width
            scope.$watch('currentComponent.top', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $container.css("top", scope.component.top * scale);
            }); 

            scope.$watch('currentComponent.left', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $container.css("left", scope.component.left * scale);
            }); 

            scope.$watch('currentComponent.width', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $container.css("width", scope.component.width * scale);
            }); 

            scope.$watch('currentComponent.height', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $container.css("height", scope.component.height * scale);
            }); 
            //
            scope.$watch('currentComponent.backgroundColor', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $("div.c-" + scope.component.type ,$container).css("background-color", scope.component.backgroundColor);
            }); 

            scope.$watch('currentComponent.backgroundImage', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $("div.c-" + scope.component.type ,$container).css("background-image", scope.component.backgroundImage);
            }); 

            scope.$watch('currentComponent.borderWidth', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $("div.c-" + scope.component.type ,$container).css("border-width", scope.component.borderWidth);
            }); 

            scope.$watch('currentComponent.borderColor', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $("div.c-" + scope.component.type ,$container).css("border-color", scope.component.borderColor);
            }); 

            scope.$watch('currentComponent.borderRadius', function(newValue, oldValue) {  
                if(attrs.preview === '1' || scope.currentComponent == null) return;
                $("div.c-" + scope.component.type ,$container).css("border-radius", scope.component.borderRadius);
            }); 

            //$(".c-c-container").removeClass("u-comChoose");
            //$container.addClass("u-comChoose");

            var item = interact($container[0], { styleCursor: false })
            .draggable({
                restrict: {
                    restriction: "parent",
                    endOnly: true,
                    elementRect: { top: 1.05, left: 1.05, bottom: -0.05, right: -0.05 }
                },
                onmove: function (event) {
                    var target = event.target,
                        x = (parseFloat($(event.target).css('left')) || 0),
                        y = (parseFloat($(event.target).css('top')) || 0);

                    x = x + event.dx;
                    y = y + event.dy;

                    $(event.target).css('left', x);
                    $(event.target).css('top', y);
                    
                    scope.$apply(function () {
                        var oTop = Math.round(y / scale);
                        var oLeft = Math.round(x / scale);
                        var oWidth = scope.component.width;
                        var oHeight = scope.component.height;
                        scope.component.top = oTop;
                        scope.component.left = oLeft;
                        scope.$emit('component.style.update', oTop, oLeft, oWidth, oHeight, $(event.target).data("id"));
                    });
                }
            })
            .resizable({
                edges: {
                    left: true, right: true, bottom: true, top: true
                }
            })
            .on('resizemove', function (event) {
                var target = event.target,
                       x = (parseFloat($(event.target).css('left')) || 0),
                       y = (parseFloat($(event.target).css('top')) || 0);

                x += event.deltaRect.left;
                y += event.deltaRect.top;
                w = event.rect.width;
                h = event.rect.height;

                $(event.target).css('left', x);
                $(event.target).css('top', y);
                $(event.target).css('width', w);
                $(event.target).css('height', h);
                
                scope.$apply(function () {
                    var oTop = Math.round(y / scale);
                    var oLeft = Math.round(x / scale);
                    var oWidth = Math.round(w / scale);
                    var oHeight = Math.round(h / scale);
                    scope.component.top = oTop;
                    scope.component.left = oLeft;
                    scope.component.width = oWidth;
                    scope.component.height = oHeight;
                    scope.$emit('component.style.update', oTop, oLeft, oWidth, oHeight, $(event.target).data("id"));
                });

            })
            .on('resizeend', function (event) {
                $($container).css("cursor", "move");
            })
            .actionChecker(function (pointer, event, action, interactable, $container, interaction) {
                if (action.name === 'resize' && $($container).hasClass("u-comChoose")) {

                    var cursorKey = 'resize',
                            edgeNames = ['top', 'bottom', 'left', 'right'];

                    for (var i = 0; i < 4; i++) {
                        if (action.edges[edgeNames[i]]) {
                            cursorKey += edgeNames[i];
                        }
                    }
                    cursor = interact.debug().actionCursors[cursorKey];

                    $($container).css("cursor", cursor);
                } else {
                    action.name = 'drag';
                }

                if (action.name === 'drag') {
                    $($container).css("cursor", "move");
                }
                return action;
            });

            $container.on('click', function (event) {
                event.stopPropagation()
                $(".c-c-container").removeClass("u-comChoose");
                $container.addClass("u-comChoose");
                //console.log($rootScope);
                $rootScope.currentComponent = scope.component;
                scope.$emit('component.choose', scope.component);
                scope.$emit('component.style.update', scope.component.top, scope.component.left, 
                  scope.component.width, scope.component.height, 
                  scope.component.id);
                scope.$apply();
            });

            $(".tr-c,.bl-c", $container).on('mouseenter', function () {
                $container.css("cursor", "ne-resize");
            }).on('mouseleave', function (e) {
                $container.css("cursor", "move");
            });

            $(".tl-c,.br-c", $container).on('mouseenter', function () {
                $container.css("cursor", "nw-resize");
            }).on('mouseleave', function (e) {
                $container.css("cursor", "move");
            });
        }
    }
}]);

//animation_panel start

//animation_panel end

//config_section start

mainModule.directive("sectionCropperDirective", function () {
    return {
        restrict: "A",
        template: tpl_config_section_cropper,
        replace: true,
        link: function (scope, element, attrs) {
            var $image = $('.jcrop-wrap>img', element);

            // ngModelController.$render = function () {
            //     var viewValue = ngModelController.$viewValue;
            // }
            $image.attr("src", scope.currentComponent.url);

            function initCropperBox() {
                var ratio = 0.2;
                $image.cropper('setCropBoxData', {
                    top: 10,
                    left: 0,
                    width: 10,
                    height: 10
                });
            }

            var options = {
                viewMode: 2,
                //dragMode: 'none',
                //preview: '.preview-container',
                aspectRatio: 'NaN',
                modal: false,
                checkCrossOrigin: false,
                //preview: '.img-preview',
                //background: false,
                autoCrop: false,
                autoCropArea: 1,
                //scalable: true,
                zoomOnWheel: false,
                built: function () {
                    initCropperBox();
                    $image.cropper('crop');
                    //$image.cropper('clear');
                }
            }

            $image.cropper(options);
            
            $(".jcrop-setUp ul>li", element).on("click", function(){
                $(".jcrop-setUp ul>li", element).removeClass("curr");
                $(this).addClass("curr");
                var data = $(this).data("value"); 
                switch(data){
                    case 0: options.aspectRatio = 'NaN'; break;
                    case 1: options.aspectRatio = 1; break;
                    case 2: options.aspectRatio = 1.3333333333333333; break;
                    case 3: options.aspectRatio = 1.7777777777777777; break;
                    case 4: break;
                } 
                console.log(data, options);
                if (data == 4) return;

                $image.cropper('setAspectRatio', options.aspectRatio);
                
            });

            $image.on('cropend.cropper', function (e) {
                console.log(e); // cropstart
                console.log(e.namespace); // cropper
                console.log(e.action); // ...
                console.log(e.originalEvent.pageX);

                // Prevent to start cropping, moving, etc if necessary
                if (e.action === 'crop') {
                    e.preventDefault();
                }
            });
            $image.on('crop.cropper', function (e) {
                console.log(e);

                scope.currentComponent.imageStyle["margin-top"] = -e.y * scope.scale;
                scope.currentComponent.imageStyle["margin-left"] = -e.x * scope.scale;
                scope.currentComponent.width = e.width;
                scope.currentComponent.height = e.height;
                scope.$apply();
            });
        }
    }
});
//config_section end

//config_background

