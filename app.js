var App = angular.module('app', [
    'ui.router',
    'ng-token-auth'
  ]);

App.config(['$authProvider', '$stateProvider', '$urlRouterProvider',
  function($authProvider, $stateProvider, $urlRouterProvider) {
    api_url = 'http://127.0.0.1:3000/api/v1';
    $authProvider.configure([
      {
        "default": {
          apiUrl:  api_url,
          omniauthWindowType: 'sameWindow',
          storage:            'localStorage',
          forceValidateToken:  false,
          validateOnPageLoad:  true,
          proxyIf:             function() { return false; },
          authProviderPaths: {
            google: '/auth/google'
          },
          tokenFormat: {
            "access-token": "{{ token }}",
            "token-type":   "Bearer",
            "client":       "{{ clientId }}",
            "expiry":       "{{ expiry }}",
            "uid":          "{{ uid }}"
          }
        }
      }
    ]);

    // default route
    $urlRouterProvider.otherwise('/app');

    $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: './index.html'
    })

}]);

App.run([
  "$rootScope", "$state", '$auth', '$location',　'$window',

  function ($rootScope, $state, $auth, $location, $window) {
    // Set reference to access them from any scope
    $rootScope.$state = $state;

    $auth.validateUser();

    $rootScope.$on('auth:login-success', function(ev, reason) {
      $rootScope.login_error_msg = '';
      $location.path('app/machines/summary');
    });
    $rootScope.$on('auth:validation-success', function(ev, reason) {
      $rootScope.login_error_msg = '';
      // アドレスバーにトークン文字列が表示されっぱなしにならないようにハードリダイレクトで消す
      if (/auth_token=/.test($window.location.search)) {
        $window.location.replace($window.location.href.replace(/\?.*$/, ''));
      }
    });

    $rootScope.$on('auth:login-error', function(ev, reason) {
      $rootScope.login_error_msg = 'Invalid e-mail address or password. Please try again.';
      $location.path('app/sign_in');
    });

    $rootScope.$on('auth:validation-error', function(ev, reason) {
      console.log("validation error");
      $rootScope.login_error_msg = 'Validation error.';
      $location.path('app/sign_in');
    });

    $rootScope.$on('auth:invalid', function(ev, reason) {
        console.log("invalid error");
      $rootScope.login_error_msg = 'Please login with e-mail address and password.';
      $location.path('app/sign_in');
    });

    $rootScope.$on('auth:logout-success', function(ev, reason) {
      $rootScope.login_error_msg = '';
      $location.path('app/sign_in');
    });

    $rootScope.$on('auth:logout-error', function(ev, reason) {
      $rootScope.login_error_msg = 'Logout error';
      $location.path('app/sign_in');
    });

    $rootScope.$on('auth:session-expired', function(ev) {
        console.log("expire error");
      alert('Session has expired');
    });
}]);


App.controller('LoginController', [
  '$scope',
  /**
   * @param {ng.IScopeService} $scope
   */
  function ($scope) {

  }
]);
