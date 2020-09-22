const initPerfanalytics = (serviceUrl = 'https://perfanalytics-app.herokuapp.com') => {
  let isMetricsSent = false

  window.__perfanalytics = {
    values: {
      files: [],
      url: window.location.href,
      user_agent: navigator.userAgent,
      fcp: null,
      ttfb: null,
      dom_load: null,
      window_load: null,
      navigation_started_at: null,
    }
  }

  const hasEmptyField = (object) => {
    for (let key in object) {
      if(object[key] === null) return true
    }
    return false
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
        if(entry.name !== 'first-contentful-paint') return

        getPerfanalytics().values['fcp'] = asSeconds(entry.startTime)
        // Sometimes fcp info comes after window load event.
        sendDataIfAppropriate()
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
    observer.observe({ entryTypes: ['paint', 'resource'], buffered: true })
  }

  startObserver()

  const sendDataIfAppropriate = async () => {
    const values = getPerfanalytics().values

    if(hasEmptyField(values) || isMetricsSent) {
      console.log('values has empty field', values)
      return
    }

    console.log('***', values)
    isMetricsSent = true
    const rawResponse = await fetch(`${serviceUrl}/metrics`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    })
    const res = await rawResponse.json()
    console.log(res)
  }

  const onWindowLoad = () => {
    const { performance: { timing } } = window
    const values = window.__perfanalytics.values

    values.ttfb = asSeconds(timing.responseStart - timing.requestStart) // Time To First Byte
    values.dom_load = asSeconds(timing.domContentLoadedEventEnd - timing.navigationStart)
    values.window_load = asSeconds(new Date().valueOf() - timing.navigationStart)
    values.navigation_started_at = new Date(timing.navigationStart).toString()
    values.files['document'] = asSeconds(timing.responseEnd - timing.navigationStart)

    sendDataIfAppropriate()
  }

  console.log(window.performance)

  window.onload = onWindowLoad
}
