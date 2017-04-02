(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Player Management
	///

	app.factory('gamePlayerMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var gamePlayer;
		var getPlayerPromise;
		var getGamePlayersPromise;

		var service = {
			getPlayer: function(gamePlayerId) {
				var url = '/gameplayers/' + gamePlayerId;
				getPlayerPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getPlayerPromise;
			},

			getGamePlayersByGameId: function(gameId) {
				var url = '/gameplayers/byGamePlayerId/' + gameId;
				getGamePlayersPromise = $http.get(url).then(function(res) {
					return res.data;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getPlayerPromise;
			},

			createPlayer: function(gamePlayerData) {
				var url = '/gameplayers/create';
				return $http.post(url, gamePlayerData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoPlayer(data, true);
						return gamePlayer;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updatePlayer: function(gamePlayerData) {
				var url = '/gameplayers/' + gamePlayerData.id;
				return $http.put(url, gamePlayerData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoPlayer(data, true);
						return gamePlayer;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			// TODO: This probably can be replaced with client-side only code
			logout: function() {
				var url = '/gameplayers/logout';
				return $http.get(url).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoPlayer({}, true);
						// TODO - Clear session also
					}
				).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			getSession: function() {
				var url = '/gameplayers/session';
				return $http.get(url).then(function(sessionRes) {
					if(! (sessionRes && sessionRes.data)) {
						return $q.reject(sessionRes);
					}
					return sessionRes.data;

				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					$q.reject(err);
				});
			},

			setWelcomed: function(sessionData) {
				sessionData.welcomed = true;
				var url = '/gameplayers/welcomed/' +sessionData.sid;
				return $http.put(url, sessionData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						return data;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

			// TODO - Get gamePlayer by username
			// :split services/signup.js

		};

		function mergeIntoPlayer(data, replace) {
			if(! gamePlayer) {
				gamePlayer = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(gamePlayer, function(val, key) {
					delete gamePlayer[key];
				});
			}

			angular.forEach(data, function(val, key) {
				gamePlayer[key] = val;
			});
		};

		return service;
	}

}());
