# MMM-Google-Cloud-Speech

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Add [Google Cloud Speech](https://cloud.google.com/speech-to-text/) recognition to Magic Mirror.

#### NOTE:  This is a work in progress and does not currently function


## Dependencies

This module requires you to install [SoX](http://sox.sourceforge.net).

### For Linux
`sudo apt-get install sox libsox-fmt-all`

### For Mac OS
`brew install sox`

### For Windows
[download the binaries](http://sourceforge.net/projects/sox/files/latest/download)


## Installation

After installing the required OS dependencies, you can clone this repo and install it's dependencies:

```bash
cd /path/to/MagicMirror/modules
git clone https://github.com/manifestinteractive/MMM-Google-Cloud-Speech
cd MMM-Google-Cloud-Speech
npm install
```

**NOTE:** The `npm install` may appear to be taking longer than normal, and this is expected.  There is a `postinstall` command that rebuilds installed dependencies specifically for electron.  Otherwise the voice engine won't work when you include the module in your Magic Mirror app.

## Google Cloud Setup

1. Visit the [Google Cloud Speech - Before you begin](https://cloud.google.com/speech-to-text/docs/quickstart-protocol?hl=en_US&_ga=2.267705230.-181849519.1532655913) section
2. Complete the Project Setup
3. Download the private key as JSON, and place it in the root of this module with the name `auth.json`


## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-Google-Cloud-Speech'
      position: 'top_bar',
      config: {
        debug: true,
        phrases: [
          'go to',
          'next page',
          'previous page'
        ]
      }
    }
  ]
}
```


## Configuration options

Option          | Type      | Default | Description
----------------|-----------|---------|--------------------------------------------------------------
`device`        | `string`  | `null`  | Recording Device ( not normally needed, e.g.: 'plughw:1')
`languageCode`  | `string`  | `en-US` | Language to detect ( [see complete languageCode options](https://cloud.google.com/speech-to-text/docs/languages) )
`recordProgram` | `string`  | `rec`   | Recording Method - Either `rec`, `arecord` or `sox`
`debug`         | `boolean` | `false` | Enable Debugging
`phrases`       | `array`   | `[]`    | Provides "hints" to the speech recognizer to favor specific words and phrases in the results.
