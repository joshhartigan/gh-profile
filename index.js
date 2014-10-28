#!/usr/bin/env node

var cheerio = require( 'cheerio' );
var req = require( 'request' );

var username = process.argv[2];

var errorEmoji = '❗';
if ( !username ) {
  console.log( errorEmoji + ' problem: you must specify a username.' );
  process.exit(1);
}

getUserStats(username)

function getUserStats(name) {
  req( 'https://github.com/' + name, function( err, response, data ) {

    if ( err ) {
      console.log( errorEmoji + err );
    }

    if ( response.statusCode === 404 ) {
      console.log( errorEmoji + ' problem: @' + name + ' doesn\'t exist!' );
      process.exit(1);
    }

    if ( response.statusCode === 200 ) {
      $ = cheerio.load(data);

      var yearlyCommits = $( '.contrib-number' ).text().split(' ')[0];

      var longestStreak = $( '.contrib-number' ).text().split(' ')[1]
        .replace( 'total', '' );

      var currentStreak = $( '.contrib-number' ).text().split(' ')[2]
        .replace( 'days', '' );

      logUserStats( yearlyCommits, longestStreak, currentStreak );
    }

  });
}

function logUserStats( yearlyCommits, longestStreak, currentStreak ) {
  console.log( '@' + username + ' has pushed ' + yearlyCommits + ' this year' );
  console.log( 'their longest streak lasted ' + longestStreak + ' days' );
  console.log( 'and their current streak is at ' + currentStreak + ' days' );
}

