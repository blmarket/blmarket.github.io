var CommentsCtrl;

angular.module('trello-comments', ['ngResource']);

Trello.authorize({
  interactive: false
});

CommentsCtrl = function($scope, $resource) {
  $scope.board_id = '519394de1fb3e3b9110042c7';
  $scope.comments = [];
  $scope.authorized = Trello.authorized;
  $scope.authorize = function() {
    Trello.authorize({
      type: 'popup',
      scope: {
        read: true,
        write: false
      },
      success: function() {
        if (!Trello.authorized()) {
          return;
        }
        if (!$scope.authorized) {
          $scope.fetchComments();
        }
        $scope.authorized = true;
      }
    });
  };
  $scope.fetchComments = function() {
    Trello.get("boards/" + $scope.board_id + "/actions", {
      limit: 25,
      filter: 'commentCard'
    }, function(data) {
      return $scope.$apply(function() {
        return $scope.comments = data;
      });
    });
  };
  $scope.openCard = function(card_id) {
    Trello.get("cards/" + card_id, function(data) {
      window.open(data.url);
    });
  };
};
