const initPerfanalytics = () => {
  window.__perfanalytics = {
    values: {
      files: [],
      url: window.location.href,
      user_agent: navigator.userAgent
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
      file_type: entry.initiatorType,
      responseEnd: asSeconds(entry.responseEnd)
    })
  
    const observerEntryHandlers = {
      paint(entry) {
        getPerfanalytics().values['fcp'] = asSeconds(entry.startTime)
      },
      resource(entry) {
        const files = getPerfanalytics().values.files
        files.push(getTimingFromEntry(entry))
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

  const sendData = async () => {
    const { performance: { timing } } = window
    const values = window.__perfanalytics.values

    values['ttfb'] = asSeconds(timing.responseStart - timing.requestStart) // Time To First Byte
    values['dom_load'] = asSeconds(timing.domContentLoadedEventEnd - timing.navigationStart)
    values['window_load'] = asSeconds(timing.domInteractive - timing.navigationStart)
    values['navigation_started_at'] = new Date(timing.navigationStart).toString()
    values['files']['document'] = asSeconds(timing.responseEnd - timing.navigationStart)

    console.log('***', values)

    const rawResponse = await fetch('http://localhost:4040/metrics', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    });
    const res = await rawResponse.json();
    console.log(res);
  }

  console.log(window.performance)

  window.onload = sendData
}

initPerfanalytics()
