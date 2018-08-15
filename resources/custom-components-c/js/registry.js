module.exports = {
  components: {
    'advt.24hrs.flowers.orders.SubmitOrder': require('./components/orders/SubmitOrder'),
    'advt.24hrs.flowers.orders.TrackOrder': require('./components/orders/TrackOrder'),       
    'advt.24hrs.flowers.chitchat.SmallTalk': require('./components/smalltalk/SmallTalk'),
    'advt.24hrs.flowers.cmm.ShowCardMenu': require('./components/flowermenu/cmm/CardMenu'),
    'advt.24hrs.flowers.debug.HelloTester': require('./components/debug/Hello24hrsFlowers.js'),
    'advt.24hrs.flowers.menuvariable.SetMenuVariable': require('./components/flowermenu/tovariable/SetMenu'), 
    'advt.24hrs.flowers.orders.OrderSummary': require('./components/orders/OrderSummary'),
    'advt.24hrs.flowers.stop.StopWordChecker': require('./components/stopwords/StopWordChecker')
  }
};