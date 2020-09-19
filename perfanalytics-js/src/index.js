function Perfanalytics() {
  this.init = () => {
    if(!this.isPerformanceSupported()) {
      return
    }
    this.startObserver()
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

  this.asSeconds = ms => ms / 1000
  
  this.startObserver = () => {
    if(typeof(PerformanceObserver) === 'undefined') return

    const getTimingFromEntry = entry => ({
      name: entry.name,
      type: entry.initiatorType,
      responseEnd: entry.responseEnd
    })
  
    const observerEntryHandlers = {
      paint(entry) {
        this.getPerfanalytics().values['fcp'] = this.asSeconds(entry.startTime)
      },
      resource(entry) {
        const network_timings = this.getPerfanalytics().values.network_timings
        if(network_timings[entry.initiatorType]) {
          network_timings[entry.initiatorType].total += this.asSeconds(entry.responseEnd)
          network_timings[entry.initiatorType].items.push(getTimingFromEntry(entry))
        } else {
          network_timings[entry.initiatorType] = {
            total: this.asSeconds(entry.responseEnd),
            items: [getTimingFromEntry(entry)]
          }
        }
      }
    }
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        observerEntryHandlers[entry.entryType](entry)
      }
    })
    observer.observe({entryTypes: ['paint', 'resource']})
  }
}

Perfanalytics.init()
