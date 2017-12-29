var app=angular.module('app',[]);

app.controller('AppCtrl',['$scope','$http',function ($scope,$http) {

    $scope.action = "Add";
    $scope.add = true;
    $scope.hdt = false;
    $scope.qry = [];
    $scope.query = function () {
        var d_qstdt = $scope.qstdt.split("/");
        var fd_qstdt = d_qstdt[2]+d_qstdt[0]+d_qstdt[1];
        var d_qedt = $scope.qedt.split("/");
        var fd_qedt = d_qedt[2]+d_qedt[0]+d_qedt[1];
        for(var i=0;i<$scope.fdlist.length;i++)
        {

            if($scope.fdlist[i].fd_dtpr >= fd_qstdt && $scope.fdlist[i].fd_dtmt<= fd_qedt)
            {
                //console.log("HERE");
                $scope.qry[i]=true;
            }
            else
            {
                //console.log("false HERE");
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
        console.log($scope.fd.dtpr);
        console.log($scope.fd.dtmt);
        var d_dtpr = $scope.fd.dtpr.split("/");
        $scope.fd.fd_dtpr = d_dtpr[2]+d_dtpr[0]+d_dtpr[1];
        console.log($scope.fd.fd_dtpr);
        var d_dtmt = $scope.fd.dtmt.split("/");
        $scope.fd.fd_dtmt = d_dtmt[2]+d_dtmt[0]+d_dtmt[1];
        console.log($scope.fd.fd_dtmt);
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