var app=angular.module('app',[]);

app.controller('AppCtrl',['$scope','$http',function ($scope,$http) {

    $scope.action = "Add";
    $scope.add = true;
    $scope.hdt = false;
    $scope.qry = [];
    $scope.query = function () {

        for(var i=0;i<$scope.fdlist.length;i++)
        {
            if($scope.fd.dtpr <= $scope.qstdt && $scope.fd.dtmt>=$scope.qedt)
            {
                $scope.qry[i]=true;
            }
            else
            {
                $scope.qry[i]=false;
            }
            /*console.log($scope.fdlist[i]);*/
        }
    };

    var refresh = function () {

        $scope.action = "Add";
        $scope.add = true;
        $http.get('/fdlist').then(function (response) {
            //console.log(response.data);
            //var contactlist = response.data;
            console.log(response.data);
            $scope.fdlist = response.data;
            for(var i=0;i<$scope.fdlist.length;i++)
            {
                $scope.qry.push(true);
            }
        });
    };

    refresh();
    $scope.addfd = function () {
        console.log($scope.fd);
        $scope.fd.gain = (parseInt($scope.fd.amtmt) || 0) - (parseInt($scope.fd.amtpr)||0);

        console.log($scope.fd.gain);
        $http.post('/fdlist',$scope.fd).then(function (response) {
            console.log(response);
            $scope.fd = {};
            refresh();
        });
    };

    $scope.deletefd = function (id) {
        console.log(id);
        $http.delete('/fdlist/' + id).then(function (response) {
            refresh();
        });
    };

    $scope.editfd = function (id) {

        $scope.add = false;
        $scope.action = "Update";
        console.log(id);
        $http.get('/fdlist/' + id).then(function (response) {
            console.log(response.data);

            $scope.fd = response.data;
        });
    };

    $scope.updatefd = function (id) {
        console.log(id);
        console.log("Sending to POST");
        $scope.fd.gain = (parseInt($scope.fd.amtmt) ||0) - (parseInt($scope.fd.amtpr)||0);

        $http.put('/fdlist/' + id,$scope.fd).then(function (response) {
            refresh();
            $scope.fd={};
        });
    };

    $scope.clear = function () {
        $scope.action = "Add";
        $scope.add = true;
        $scope.fd = {};
    }
}]);