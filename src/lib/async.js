/** The error fetch() and friends throw when an AbortSignal fires. */
export function abortError() {
  return new DOMException('The operation was aborted.', 'AbortError')
}

export function isAbortError(error) {
  return error?.name === 'AbortError'
}

/** Promise-based setTimeout that rejects with an AbortError when `signal` aborts. */
export function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError())
      return
    }

    const timer = window.setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer)
        reject(abortError())
      },
      { once: true },
    )
  })
}
