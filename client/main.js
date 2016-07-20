import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';
import 'angular-leaflet-directive';

angular.module('flatmap', [
        angularMeteor,
        ngMaterial,
        ngAnimate,
        'leaflet-directive'
    ])
    .config(['$mdThemingProvider', '$logProvider', ($mdThemingProvider, $logProvider) => {
        $mdThemingProvider.theme('default')
            .primaryPalette('amber')
            .accentPalette('grey');

        $logProvider.debugEnabled(false);
    }])
    .controller('MapCtrl', ['$scope', '$reactive', ($scope, $reactive) => {
        $reactive(this).attach($scope);
        var now = new Date();

        $scope.mapCenter = {
            lat: 52.509087,
            lng: 13.404694,
            zoom: 13
        };

        $scope.mapLayers = {
            baselayers: {
                mapbox_dark: {
                    name: 'Mapbox Dark',
                    url: 'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={apikey}',
                    type: 'xyz',
                    layerOptions: {
                        apikey: 'pk.eyJ1IjoiamdvbnRydW0iLCJhIjoiY2lqNW94M3UzMDAzaHZqbTN1cXNmc3JrcCJ9.DW6htrp4-X6lPeinuhUXjQ' // don't ya dare steal this key :P
                    }
                }
            }
        }

        $scope.mapMarkers = {};

        $scope.subscribe('immos', () => [400], {
            onReady: () => {
                var cursor = Immos.find({});
                if (!cursor.count()) return;

                console.log("Processing new data...");

                cursor.forEach(row => {
                    var classes = "marker-icon ";

                    var rentScore = Math.max(row.rent, row.totalRent) / 600;

                    var size = 36 * rentScore;
                    size = Math.min(72, size);
                    size = Math.max(8, size);

                    var timeDelta = Math.abs(now.getTime() - row.createdAt.getTime()) / 36e5;
                    alpha = Math.min(1.0, 1.5 / timeDelta);
                    alpha = Math.max(0.2, alpha);

                    if (timeDelta < 2.0) {
                        classes += "new ";
                    }

                    $scope.mapMarkers[row._id._str] = {
                        lat: row.geocoding.lat,
                        lng: row.geocoding.lng,
                        icon: {
                            type: 'div',
                            iconSize: [10, 0],
                            html: '<div class="' +
                                classes + '" style="font-size: ' +
                                size + 'pt; color: rgba(255, 255, 255, ' +
                                alpha + ')">&#8226;</div>',
                            popupAnchor: [0, 0],
                            focus: false,
                            draggable: false,
                            clickable: false
                        }
                    }
                });
            }
        });
    }]);
