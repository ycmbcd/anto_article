var app=angular.module('myApp');
app.controller('addgoodsCtrl', ['$scope','$state','$http', function($scope,$state,$http){
	//新建商品
	$http.get('/fuck/field/commonfield.php', {params:{select_comfield:"get"}
    }).success(function(data) {
        $scope.all_commonfield = data;
    }).error(function(data) {
        alert("系统错误，请联系管理员。");
    });
    $scope.conf = [];
    $scope.oookkk=function(){
    	alert($scope.conf)
    }
    $scope.ok = function(e,f){
    	// alert(e)
    	// alert(f)
    }
}])