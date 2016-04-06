var express = require('express');
var router = express.Router();

var Movie = require('../models/movie');

router.route('/movies')
    .get(function(req, res) {
        Movie.find()
            .select('title year_of_release rating')
            .exec(function(err, movies) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('movies/index', {
                        'movies': movies
                    });
                    // res.json(movies);
                }
            });
    })
    .post(function(req, res) {
        console.log(req.body);
        formdata = req.body;

        var movie = new Movie(formdata);
        movie.save(function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                console.log('succesfully saved the movie');
                res.redirect('/movies');
            }
        });
    });


router.route('/movies/new')
    .get(function(request, response) {

        response.render('movies/new');

    });


function updateMovie(method, request, response) {
    movieId = request.params.id;
    userRating = request.body.rating;
    userTitle = request.body.title;

    //Update the movie from Mongodb
    Movie.findById(movieId, function(err, movie) {
        if (err) return console.log(err);

        movie.rating = userRating;
        movie.title = userTitle;
        movie.save(function(err, movie) {
            if (err) return console.log(err);
            if (method === 'POST') {
                response.json(movie);
            } else {
                res.redirect('/movies/' + movie._id);
            }
        });
    });
}


function deleteMovie(method, request, response) {
    movieId = request.params.id;

    //Delete the movie from Mongodb
    Movie.remove({
        _id: movieId
    }, function(err) {
        if (err) return console.log(err);
        if (method === 'GET') {
            response.redirect('/movies');
        } else {
            response.send('Movie was deleted');
        }
    });
}


router.route('/movies/:id/edit')
    .get(function(request, response) {

        // response.render('movies/edit');
        movieId = request.params.id;

        //retrieve the movie from mongodb
        Movie.findById(movieId, function(err, movie) {
            if (err) return console.log(err);

            response.render('movies/edit', {
                'movie': movie
            });
            // response.json(movie);
        });

    })
    .post(function(request, response) {
        updateMovie('POST', request, response);
        console.log('succesfully updated');
    });


router.route('/movies/:id')
    .get(function(request, response) {
        movieId = request.params.id;

        //retrieve the movie from mongodb
        Movie.findById(movieId, function(err, movie) {
            if (err) return console.log(err);

            response.render('movies/detail', {
                'movie': movie
            });
            // response.json(movie);
        });
    })
    .put(function(request, response) {
        updateMovie('PUT', request, response);
    })
    .delete(function(request, response) {
        deleteMovie('DELETE', request, response);
    });



router.route('/movies/:id/delete')
    .get(function(request, response) {
        deleteMovie('GET', request, response);
    });

module.exports = router;
