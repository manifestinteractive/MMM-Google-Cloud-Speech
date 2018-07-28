Module.register('MMM-Google-Cloud-Speech', {
	requiresVersion: '2.1.0',

  defaults: {
		debug: false,
		device: null,
		languageCode: 'en-US',
		recordProgram: 'rec',
		phrases: []
  },

	debug(message) {
		if (this.config.debug) {
			console.log(message)
		}
	},

	start() {
		this.sendSocketNotification('GOOGLE_CLOUD_SPEECH_INIT', this.config)
  },

	getDom() {
		const wrapper = document.createElement('div');

		wrapper.innerHTML = this.command || 'say something';

		return wrapper;
	},

	getStyles() {
      return ['MMM-Google-Cloud-Speech.css'];
  },

	socketNotificationReceived(notification, payload) {
    if (notification === 'GOOGLE_CLOUD_SPEECH_COMMAND' && typeof payload === 'string') {
      this.debug({
				notification: notification,
				payload: payload
			})

			this.command = payload
			this.updateDom(300)
    }
  }
})
