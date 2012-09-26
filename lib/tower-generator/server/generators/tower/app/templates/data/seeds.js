_.series([], function(error) {
  if (error) {
    console.log('Something went wrong creating seed data... Try changing something and running again.');
  } else {
    console.log('Successfully created seed data!');
  }
  process.exit();
});
