/**
 * ActionsController
 *
 * @description :: Server-side logic for managing actions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

var serverError = 'An error occurred. Please try again later.';

module.exports = {
	byTournamentId: function(req, res) {
		Actions.find({tournamentId: req.params.id}).sort({
		}).limit(20).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Actions.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  }
};

