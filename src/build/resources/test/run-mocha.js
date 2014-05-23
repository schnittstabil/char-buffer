function exposeMochaResults(){
  window.mochaResults = runner.stats;
}

//mocha.checkLeaks();
mocha.reporter(ScreencastReporter);

var runner = mocha.run();

runner.on('end', exposeMochaResults);
// test if already ended:
if(runner.stats.end){
  exposeMochaResults();
}
