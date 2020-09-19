function Perfanalytics() {
  this.init = () => {
    if(!isPerformanceSupported()) {
      return
    }
    console.log(window.performance)
    
    window.__perfanalytics = {
      values: {
        network_timings: {}
      }
    }

    window.onload = this.send
  }

  this.sendData = () => {
    const { performance: { timing } } = window
    const values = window.__perfanalytics.values
    console.log('***', values)
    // TODO: Send the data without harming client performance
  }

  this.isPerformanceSupported = () => {
    return window.performance && !!window.performance.getEntriesByType && !!window.performance.timing
  }

  this.getPerfanalytics = () => window.__perfanalytics
}

Perfanalytics.init()
