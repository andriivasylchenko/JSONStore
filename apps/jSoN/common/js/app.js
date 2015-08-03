// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'timer', 'ngTable'])

    .directive('scroll', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$watchCollection(attr.scroll, function (newVal) {
                    $timeout(function () {
                        element[0].scrollTop = element[0].scrollHeight;
                    });
                });
            }
        }
    })

    .controller('MainCtrl', function ($scope, $http, $filter, $q) {

        $scope.nDocs = 1000;
        $scope.timeSpent = '';
        $scope.initTime = '';
        $scope.putTime = '';
        $scope.loadTime = '';
        $scope.getTime = '';
        $scope.destroyTime = '';
        $scope.closeTime = '';
        $scope.loadedDocs = '';
        $scope.dataInStore = [];
        $scope.errorMessage = '';
        $scope.displayError = false;

        $scope.timerRunning = false;
        $scope.showData = false;
        $scope.partitionData = false;

        $scope.logScope = [{message: "Application loaded"}];

        $scope.safeApply = function (fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $scope.putDocs = function (numberOfDocs) {
            $scope.nDocs = numberOfDocs;
            $scope.safeApply();
        };

        $scope.callInitStore = function () {
            $scope.startTimer();
            try {
                $scope.errorMessage = '';
                $scope.displayError = false;
                $scope.initStore().then(function (results) {
                    $scope.stopTimer();
                    $scope.initTime = $scope.timeSpent;
                    $scope.destroyTime = '';
                    $scope.closeTime = '';
                    $scope.putTime = '';
                    $scope.getTime = '';
                    $scope.messageToLog = {message: "Init process took " + $scope.initTime + " milliseconds"};
                    $scope.logScope.push($scope.messageToLog);
                    $scope.safeApply();
                });
            }
            catch (e) {
                console.error('An error has occurred: ' + e.message);
                $scope.errorMessage = e.message;
                $scope.displayError = true;
                $scope.stopTimer();
                $scope.safeApply();
            }
        };

        $scope.initStore = function () {
            console.log('called store init');

            var collections = {
                items: {
                    searchFields: {index: 'integer', fullname: 'string', email: 'string'}
                }
            };


            return WL.JSONStore.init(collections);

        };

        $scope.callPutDataToStore = function () {
            $scope.startTimer();
            try {
                  $scope.errorMessage = '';
                  $scope.displayError = false;
                  $scope.putDataToStore().then(function (results) {
                      $scope.stopTimer();
                      $scope.putTime = $scope.timeSpent;
                      $scope.messageToLog = {message: "Put process for " + $scope.nDocs + " docs took " + $scope.putTime + " milliseconds"};
                      $scope.logScope.push($scope.messageToLog);
                      $scope.$apply();
                  });
              }
              catch (e) {
                  console.error('An error has occurred: ' + e.message);
                  $scope.errorMessage = e.message;
                  $scope.displayError = true;
                  $scope.stopTimer();
                  $scope.safeApply();
              }
        };

        $scope.putDataToStore = function () {
            console.log('called put data to store');
            $scope.getFile = function () {

                return $http.get('data/' + $scope.nDocs + 'rows.json').success(function (data) {
                    $scope.largeFile = data.items;
                });
            };

            return $scope.getFile().then(function () {
              if ($scope.partitionData === true) {
                console.log('Partition true');
                return chunks($scope.largeFile, 1000);
              } else {
                console.log('Partition false');
                return WL.JSONStore.get('items').add($scope.largeFile);
              }
            });

        };

        var chunks = function (arr, chunkSize) {
          var promises = [];
          while(arr.length) {
              promises.push(WL.JSONStore.get('items').add(arr.splice(0,chunkSize)));
              console.log('Putting array portion');
          }
          $q.all(promises).then(function() {
              return arr.length;
          });
        };

        $scope.toggleChange = function() {
                if ($scope.partitionData == false) {
                    $scope.partitionData = true;
                } else
                    $scope.partitionData = false;
                console.log('partitionData changed to ' + $scope.partitionData);
            };


        $scope.callGetDataFromStore = function () {
            $scope.startTimer();
            try {
                $scope.errorMessage = '';
                $scope.displayError = false;
                $scope.getDataFromStore().then(function (results) {
                    $scope.stopTimer();
                    $scope.getTime = $scope.timeSpent;
                    $scope.dataInStore = results;
                    $scope.showData = true;
                    $scope.messageToLog = {message: "Get process took " + $scope.getTime + " milliseconds"};
                    $scope.logScope.push($scope.messageToLog);
                    $scope.safeApply();
                    console.log('results', results);
                });
            }
            catch (e) {
                console.error('An error has occurred: ' + e.message);
                $scope.errorMessage = e.message;
                $scope.displayError = true;
                $scope.stopTimer();
                $scope.safeApply();
            }

        };

        $scope.getDataFromStore = function () {
            console.log('called get data from store');
            var query = {index: 999};
            var collectionName = 'items';
            var options = {
                exact: false,
                limit: 10 //returns a maximum of 10 documents
            };

            return WL.JSONStore.get(collectionName).find(query, options);
        };

        $scope.callCloseStore = function () {
            $scope.startTimer();
            try {
                $scope.errorMessage = '';
                $scope.displayError = false;
                $scope.closeStore().then(function (results) {
                    $scope.stopTimer();
                    $scope.closeTime = $scope.timeSpent;
                    $scope.initTime = '';
                    $scope.putTime = '';
                    $scope.getTime = '';
                    $scope.destroyTime = '';
                    $scope.showData = false;
                    $scope.messageToLog = {message: "Close process took " + $scope.closeTime + " milliseconds"};
                    $scope.logScope.push($scope.messageToLog);
                    $scope.safeApply();
                });
            }
            catch (e) {
                console.error('An error has occurred: ' + e.message);
                $scope.errorMessage = e.message;
                $scope.displayError = true;
                $scope.stopTimer();
                $scope.safeApply();
            }
        };

        $scope.closeStore = function () {
            console.log('called close store');
            return WL.JSONStore.closeAll();
        };

        $scope.callDestroyStore = function () {
            $scope.startTimer();
            try {
                $scope.errorMessage = '';
                $scope.displayError = false;
                $scope.destroyStore().then(function (results) {
                    $scope.stopTimer();
                    $scope.destroyTime = $scope.timeSpent;
                    $scope.initTime = '';
                    $scope.putTime = '';
                    $scope.getTime = '';
                    $scope.showData = false;
                    $scope.messageToLog = {message: "Destroy process took " + $scope.destroyTime + " milliseconds"};
                    $scope.logScope.push($scope.messageToLog);
                    $scope.safeApply();
                });
            }
            catch (e) {
                console.error('An error has occurred: ' + e.message);
                $scope.errorMessage = e.message;
                $scope.displayError = true;
                $scope.stopTimer();
                $scope.safeApply();
            }
        };

        $scope.destroyStore = function () {
            console.log('called destroy store');
            return WL.JSONStore.destroy();
        };

        $scope.callCountStore = function () {
            $scope.startTimer();
            try {
                $scope.errorMessage = '';
                $scope.displayError = false;
                $scope.countStore().then(function (results) {
                    $scope.stopTimer();
                    $scope.loadTime = $scope.timeSpent;
                    $scope.loadedDocs = results;
                    console.log('Loaded docs', $scope.loadedDocs);
                    $scope.messageToLog = {message: "Count process for " + $scope.loadedDocs + " docs took " + $scope.loadTime + " milliseconds"};
                    $scope.logScope.push($scope.messageToLog);
                    $scope.messageToLog = {message: $scope.loadedDocs + " docs in collection, " + $filter('number')($scope.loadedDocs*0.1862) + " Kbytes"};
                    $scope.logScope.push($scope.messageToLog);
                    $scope.safeApply();
                });
            }
            catch (e) {
                console.error('An error has occurred: ' + e.message);
                $scope.errorMessage = e.message;
                $scope.displayError = true;
                $scope.stopTimer();
                $scope.safeApply();
            }

        };

        $scope.countStore = function () {
            console.log('called count store');
            return WL.JSONStore.get('items').count();
        };


        $scope.startTimer = function () {
            $scope.$broadcast('timer-start');
            $scope.timerRunning = true;
        };

        $scope.stopTimer = function () {
            $scope.$broadcast('timer-stop');
            $scope.timerRunning = false;
        };

        $scope.$on('timer-stopped', function (event, data) {
            $scope.timeSpent = data.millis;
            console.log('Time past', $scope.timeSpent);
        });

    });
