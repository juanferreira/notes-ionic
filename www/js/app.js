(function(){

    var app = angular.module('notes', ['ionic']);

    app.config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/list');

        $stateProvider.state('list', {
            url: '/list',
            templateUrl: 'templates/list.html'
        });

        $stateProvider.state('edit', {
            url: '/edit/:noteId',
            templateUrl: 'templates/edit.html',
            controller: 'EditCtrl'
        });

        $stateProvider.state('add', {
            url: '/add',
            templateUrl: 'templates/edit.html',
            controller: 'AddCtrl'
        });
    });

    app.controller('ListCtrl', function($scope, NoteService){
        $scope.notes = NoteService.getNotes();
        $scope.reorder = false;

        $scope.remove = function(noteId) {
            NoteService.removeNote(noteId);
        };

        $scope.move = function(note, fromIndex, toIndex) {
            NoteService.move(note, fromIndex, toIndex);
        };

        $scope.toggleReordering = function() {
            $scope.reorder = !$scope.reorder;
        };
    });

    app.controller('EditCtrl', function($scope, $state, NoteService){
        $scope.title = 'Edit Note';
        $scope.buttonTitle = 'Save';
        $scope.note = angular.copy(NoteService.getNote($state.params.noteId));

        $scope.save = function() {
            NoteService.updateNote($scope.note);
            $state.go('list');
        };
    });

    app.controller('AddCtrl', function($scope, $state, NoteService){
        $scope.title = 'Add Note';
        $scope.buttonTitle = 'Add';
        $scope.note = {
            id: NoteService.getNextNoteId(),
            title: '',
            description: ''
        };

        $scope.save = function() {
            NoteService.insertNote($scope.note);
            $state.go('list');
        };
    });

    app.factory('NoteService', function(){
        var notes = angular.fromJson( window.localStorage['notes'] || '[]' );

        function persist() {
            window.localStorage['notes'] = angular.toJson(notes);
        }

        return {
            getNotes: function() {
                return notes;
            },

            getNote: function(noteId) {
                for(var i = 0; i < notes.length; i++ ) {
                    if( notes[i].id == noteId ) {
                        return notes[i];
                    }
                }

                return null;
            },

            updateNote: function(note) {
                for(var i = 0; i < notes.length; i++) {
                    if(notes[i].id == note.id) {
                        notes[i] = note;
                        persist();
                        return;
                    }
                }
            },

            insertNote: function(note) {
                notes.push(note);
                persist();
            },

            removeNote: function(noteId) {
                for(var i = 0; i < notes.length; i++) {
                    if(notes[i].id == noteId) {
                        notes.splice(i, 1);
                        persist();
                        return;
                    }
                }
            },

            getNextNoteId: function() {
                return notes.length + 1;
            },

            move: function(note, fromIndex, toIndex) {
                notes.splice(fromIndex, 1);
                notes.splice(toIndex, 0, note);
                persist();
            }
        };
    });

    app.run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });
    });

})();