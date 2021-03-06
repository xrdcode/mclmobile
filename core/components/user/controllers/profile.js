// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.core.user')

/**
 * Controller to handle a user profile page.
 *
 * @module mm.core.user
 * @ngdoc controller
 * @name mmaParticipantsProfileCtrl
 */
.controller('mmUserProfileCtrl', function($scope, $state, $stateParams, $mmUtil, $mmUser, $mmUserDelegate, $mmSite) {

    var courseid = $stateParams.courseid,
        userid   = $stateParams.userid;

    $scope.isAndroid = ionic.Platform.isAndroid();
    $scope.plugins = [];

    $mmUser.getProfile(userid, courseid).then(function(user) {

        user.address = $mmUser.formatAddress(user.address, user.city, user.country);
        if (user.address) {
            user.encodedAddress = encodeURIComponent(user.address);
        }

        $mmUser.formatRoleList(user.roles).then(function(roles) {
            user.roles = roles;
        });

        $scope.user = user;
        $scope.title = user.fullname;
        $scope.hasContact = user.email || user.phone1 || user.phone2 || user.city || user.country || user.address;
        $scope.hasDetails = user.url || user.roles || user.interests;

        $scope.plugins = $mmUserDelegate.getData(user, courseid);

        // Add log in Moodle.
        $mmSite.write('core_user_view_user_profile', {
            userid: userid,
            courseid: courseid
        });
    }, function(message) {
        $scope.user = false;
    }).finally(function() {
        $scope.userLoaded = true;
    });

});
