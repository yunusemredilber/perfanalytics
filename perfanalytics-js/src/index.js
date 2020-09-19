const initPerfanalytics = () => {
  window.__perfanalytics = {
    values: {
      network_timings: {}
    }
  }

  const isPerformanceSupported = () => {
    return window.performance && !!window.performance.getEntriesByType && !!window.performance.timing
  }

  if(!isPerformanceSupported()) {
    return
  }

  const getPerfanalytics = () => window.__perfanalytics

  const asSeconds = ms => ms / 1000
  
  const startObserver = () => {
    if(typeof(PerformanceObserver) === 'undefined') return

    const getTimingFromEntry = entry => ({
      name: entry.name,
      type: entry.initiatorType,
      responseEnd: entry.responseEnd
    })
  
    const observerEntryHandlers = {
      paint(entry) {
        getPerfanalytics().values['fcp'] = asSeconds(entry.startTime)
      },
      resource(entry) {
        const network_timings = getPerfanalytics().values.network_timings
        if(network_timings[entry.initiatorType]) {
          network_timings[entry.initiatorType].total += asSeconds(entry.responseEnd)
          network_timings[entry.initiatorType].items.push(getTimingFromEntry(entry))
        } else {
          network_timings[entry.initiatorType] = {
            total: asSeconds(entry.responseEnd),
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

  startObserver()

  const sendData = () => {
    const { performance: { timing } } = window
    const values = window.__perfanalytics.values

    values['ttfb'] = asSeconds(timing.responseStart - timing.requestStart) // Time To First Byte
    values['dom_load'] = asSeconds(timing.domContentLoadedEventEnd - timing.navigationStart)
    values['window_load'] = asSeconds(timing.domInteractive - timing.navigationStart)
    values['network_timings']['document'] = asSeconds(timing.responseEnd - timing.navigationStart)

    console.log('***', values)
    // TODO: Send the data without harming client performance
  }

  console.log(window.performance)

  window.onload = sendData
}

initPerfanalytics()
