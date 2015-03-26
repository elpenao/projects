var findvet = angular.module('findvet', ['ngResource']);

findvet.factory('findVetService', function($resource) {
    return $resource('store.vetsfirstchoice.com/practice/findVet_ajax/find',{},{
        findVets: {method: 'GET'}
    });
});

findvet.controller('findvetController', function ($scope, $window, findVetService) {

    //Default limit value
    $scope.data = {};
    $scope.data.limit = 20;
    $scope.loaded = false;

    $scope.setIsSaving = function(isSaving, loadingText) {
        $scope.safeApply(function(){
            $scope.isSaving = isSaving;
            $scope.loadingText = loadingText;
        });
    }

    var geocodeQuery = function(query, successCallback, failureCallback) {
        $scope.setIsSaving(true,"Searching...");
        $scope.loaded = true;
        new google.maps.Geocoder().geocode({address:query}, function(results, status) {
            if(results.size()) {
                successCallback.call($scope, results.first());
            } else {
                failureCallback.call($scope);
            }
        });
    }

    var bindData = function(data) {
        $scope.data.practices = data.practices;
        $scope.data.current_page = data.current_page;
        $scope.data.total_records = data.total_records;
        $scope.data.total_pages = data.total_pages;

        var scrollToLocation = jQuery(".find-my-vet").offset().top - window.topOffset;
        jQuery("body, html").animate({scrollTop: scrollToLocation}, 500, 'swing');
    }

    $scope.findVets = function(query, rows, page) {
       geocodeQuery(query, function(address) {
           findVetService.findVets({
                'rows':rows,
                'page':page,
                'latitude':address.geometry.location.lat(),
                'longitude':address.geometry.location.lng()
           }, function(response) {
               $scope.setIsSaving(false);
               if(response.practices.length > 0) {
                   bindData(response);
               } else {
                   $window.alert("No practices found within 10 miles. Please try searching with different criteria.");
               }
           }, function(error) {
               $window.alert("Error performing request. Please try searching with different criteria.");
               $scope.setIsSaving(false);
           });
       }, function() {
           $scope.setIsSaving(false);
           $window.alert("Could not locate that address. Please try searching with different criteria.");
       });
    }

    $scope.getNextPage = function() {
        if($scope.data.current_page == $scope.data.total_pages) {
            return false;
        } else {
            return $scope.data.current_page + 1;
        }
    }

    $scope.getPreviousPage = function() {
        if($scope.data.current_page <= 1) {
            return false;
        } else {
            return $scope.data.current_page - 1;
        }
    }

    $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
