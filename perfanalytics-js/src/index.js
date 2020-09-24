export const init = (serviceUrl = 'https://perfanalytics-app.herokuapp.com') => {
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
    observer.observe({ entryTypes: ['paint', 'resource'] })
  }

  startObserver()

  const onWindowLoad = () => {
    const { performance: { timing } } = window
    const values = window.__perfanalytics.values
    values.ttfb = asSeconds(timing.responseStart - timing.requestStart) // Time To First Byte
    values.dom_load = asSeconds(timing.domContentLoadedEventEnd - timing.navigationStart)
    values.window_load = asSeconds(new Date().valueOf() - timing.navigationStart)
    values.navigation_started_at = new Date(timing.navigationStart).toString()
    values.files['document'] = asSeconds(timing.responseEnd - timing.navigationStart)
  }

  console.log(window.performance)
  const formData = serialize(getPerfanalytics().values);
  console.log(formData, getPerfanalytics().values)
  console.log(serialize)
  window.onload = onWindowLoad
  window.addEventListener("unload", function logData() {
    navigator.sendBeacon(`${serviceUrl}/metrics`, JSON.stringify(getPerfanalytics().values));
  });
}
