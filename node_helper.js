const path = require('path')
const record = require('node-record-lpcm16')
const speech = require('@google-cloud/speech')

// Set Path to Auth File
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, 'auth.json')

module.exports = NodeHelper.create({
  debug: function (message) {
		if (this.config.debug) {
			console.log(message)
		}
	},

  startListening: function () {
    this.sendSocketNotification('GOOGLE_CLOUD_SPEECH_START')

    let self = this

    // Creates a client if it does not already exist
    const client = new speech.SpeechClient()

    // Create a recognize stream
    const recognizeStream = client.streamingRecognize({
      interimResults: false,
      singleUtterance: true,
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: self.config.languageCode,
        profanityFilter: true,
        speechContext: {
          phrases: self.config.phrases
        }
      }
    })
    .on('error', self.handleError)
    .on('data', data => self.processSpeech(data))

    let recordOptions = {
      recordProgram: this.config.recordProgram,
      sampleRateHertz: 16000,
      silence: '1.0',
      threshold: 0.5,
      verbose: this.config.debug
    }

    if (this.config.device) {
      recordOptions.device = this.config.device
    }

    record.start(recordOptions)
    .on('error', self.handleError).pipe(recognizeStream)
    .on('end', () => { self.restartListening() })
  },

  stopListening: function () {
    this.sendSocketNotification('GOOGLE_CLOUD_SPEECH_STOP')

    record.stop()

    if (this.timer) {
      clearTimeout(this.timer)
    }
  },

  restartListening: function () {
    let self = this

    this.stopListening()

    setTimeout(function () {
      self.startListening()
    }, 1000)

    // Prevent Timeout from Node waiting for someone to talk
    this.timer = setTimeout(function () {
      self.sendSocketNotification('GOOGLE_CLOUD_SPEECH_RESTARTING')
      self.stopListening()

      setTimeout(function () {
        self.startListening()
      }, 1000)
    }, 60000)
  },

  handleError: function (error) {
    this.sendSocketNotification('GOOGLE_CLOUD_SPEECH_ERROR', error)
  },

  processSpeech: function (data) {
    let command = null

    if (data.results[0] && data.results[0].alternatives[0]) {
      command = data.results[0].alternatives[0].transcript
    }

    if (command) {
      // @TODO: Process Command with Regex
      this.sendSocketNotification('GOOGLE_CLOUD_SPEECH_COMMAND', command)
    }
  },

	socketNotificationReceived: function (notification, payload) {
    if (notification === 'GOOGLE_CLOUD_SPEECH_INIT' && typeof payload === 'object') {
      this.config = payload
      this.startListening()
    }

    if (notification.indexOf('GOOGLE_CLOUD_SPEECH') > -1) {
      this.debug(notification)
      this.debug(payload)
    }
  }
})
