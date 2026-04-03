/**
 * Tiny wrapper around the Web Speech Recognition API.
 * Returns an object with start() / stop() and fires callbacks.
 */
export function createRecognition({ onResult, onError, onEnd }) {
  const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition
  if (!SR) return null

  const recognition = new SR()
  recognition.continuous     = true
  recognition.interimResults = true
  recognition.lang           = 'en-US'

  recognition.onresult = (e) => {
    let final = '', interim = ''
    for (let i = 0; i < e.results.length; i++) {
      if (e.results[i].isFinal) final   += e.results[i][0].transcript + ' '
      else                      interim += e.results[i][0].transcript
    }
    onResult?.(final + interim)
  }

  recognition.onerror = (e) => onError?.(e.error)
  recognition.onend   = onEnd

  return {
    start: () => { try { recognition.start() } catch {} },
    stop:  () => { try { recognition.stop()  } catch {} },
  }
}

export function isSpeechSupported() {
  return !!(window.SpeechRecognition ?? window.webkitSpeechRecognition)
}
