const app = angular.module('asm', ["ngRoute"]);
const API_PRODUCT = "http://localhost:3000/products/";
const API_USERS = "http://localhost:3000/users/";

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "./particals/home.html",
            controller: productHome
        })
        .when("/aboutUs", {
            templateUrl: "./particals/about.html"
        })
        .when("/Login", {
            templateUrl: "./particals/login.html",
            controller: loginCtrl
        })
        .when("/resgister", {
            templateUrl: "./particals/resgister.html",
            controller: signupCtrl
        })
        .when("/update", {
            templateUrl: "./particals/update.html",
            controller: updateCtrl
        });

});

function productHome($scope, $http) {
    $http({
        method: 'GET',
        url: API_PRODUCT
    }).then(function successCallback(response) {
        $scope.product = response.data;
    }, function errorCallback(response) {
        console.error('Failed to retrieve products:', response.status);
    });
}
app.directive('validEmail', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var emailRegex = /^[a-zA-Z0-9_]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            ngModel.$validators.evenEmail = function (value) {
                return value ? emailRegex.test(value) : false;
            };
        }
    };
});
app.directive('validTel', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var telRegex = /^(?:\+?84|0)(\d{9,10})$/;

            ngModel.$validators.evenTel = function (value) {
                return telRegex.test(value || '');
            };
        }
    };
});

app.directive('validUsername', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            ngModel.$validators.validUsername = function (value) {
                if (!value) return false; // Nếu giá trị là null hoặc undefined, không hợp lệ
                return value.length >= 5; // Kiểm tra độ dài của giá trị
            };
        }
    };
});

function loginCtrl($scope, $http, $window) {
    $scope.users = {
        username: '',
        email: '',
        phone: '',
        password: ''
    };

    $scope.login = function () {
        $http({
            method: 'GET',
            url: API_USERS
        }).then(function successCallback(response) {
            const users = response.data;
            const foundUser = users.find(function (user) {
                return user.username === $scope.users.username && user.password === $scope.users.password;
            });
            if (foundUser) {
                console.log("Đăng nhập thành công!!!!");
                localStorage.setItem('userId', foundUser.id); // Save userId to localStorage
                localStorage.setItem('username', $scope.users.username);
                localStorage.setItem('password', $scope.users.password);
                location.href = 'http://127.0.0.1:5500/index.html#!';
            } else {
                console.log("Mật khẩu hoặc tài khoản không đúng!!!!");
            }
        }, function errorCallback(response) {
            console.error('Failed to fetch user data:', response.status);
        });
    };

    $scope.checkLogin = function () {
        var username = localStorage.getItem('username');
        var password = localStorage.getItem('password');
        var userId = localStorage.getItem('userId');
        console.log(userId);
        $scope.users = {
            username: username || '',
            password: password || ''
        };
        if (username && password) {
            console.log('Thông tin người dùng đã đăng nhập:');
            console.log('Username:', username);
            console.log('Password:', password);
        } else {
            console.log('Người dùng chưa đăng nhập.');
        }
    };

    $scope.checkLogin();

    $scope.signup = function () {
        $http({
            method: 'POST',
            url: API_USERS,
            data: $scope.users
        }).then(function successCallback(response) {
            $scope.users = {
                username: '',
                password: '',
                email: '',
                phone: '',
            };
            console.log('Thêm dữ liệu thành công', response.data);
        }, function errorCallback(response) {
            console.error('Failed to add user data:', response.status);
        });
    };
}

function signupCtrl($scope, $http) {
    $scope.signup = function () {
        $http({
            method: 'POST',
            url: API_USERS,
            data: $scope.users
        }).then(function successCallback(response) {
            $scope.users = {
                username: '',
                password: '',
                email: '',
                phone: '',
            };
            console.log('Thêm dữ liệu thành công', response.data);
        }, function errorCallback(response) {
            console.error('Failed to add user data:', response.status);
        });
    };
}

function updateCtrl($scope, $http, $window) {
    $scope.user = {};
    const alertData = true;
    $scope.getUserById = function () {
        var userId = localStorage.getItem('userId');

        $http({
            method: 'GET',
            url: API_USERS + userId
        }).then(function successCallback(response) {
            $scope.users = response.data;
            console.log('Hiển thị dữ liệu thành công', $scope.user);
        }, function errorCallback(response) {
            console.error('Hiển thị dữ liệu thất bại:', response.status);
        });
    };
    $scope.getUserById();
    $scope.success = false;
    $scope.update = function () {
        var userId = localStorage.getItem('userId');
        console.log(userId);
        $http({
            method: 'PUT',
            url: API_USERS + userId,
            data: $scope.users
        }).then(function successCallback(response) {
            $scope.users = {
                username: '',
                email: '',
                phone: '',
            };
            $scope.success = true;
            console.log('Cập nhật dữ liệu thành công', response.data);
        }, function errorCallback(response) {
            console.error('Cập nhật dữ liệu thất bại:', response.status);
        });
    }
}
