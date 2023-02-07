## This is fork of an awesome [vue-wysiwyg](https://github.com/chmln/vue-wysiwyg)

vue-wysiwyg-simple has reduced number of features available to improve robustness of the editor

- Fewer tags supported ( see the list at the end of the readme )
- Only text copy-paste is supported
- Drag and drop support removed
- Upload image logic removed

## Usage


### Install vue-wysiwyg-simple

``` bash
npm install vue-wysiwyg-simple --save
```

In your `main.js`:

```js
import wysiwyg from "vue-wysiwyg-simple";
Vue.use(wysiwyg, {}); // config is optional. more below
```

Also make sure to load the stylesheet.
The exact syntax will depend on what preprocessor you use.

```css
@import "~vue-wysiwyg-simple/dist/vueWysiwyg.css";
```

In your components:
```html
<wysiwyg v-model="myHTML" />
```

## Config options

All keys are optional.

```js
{
  // { [module]: boolean (set true to hide) }
  hideModules: { "bold": true },

  // you can override icons too, if desired
  // just keep in mind that you may need custom styles in your application to get everything to align
  iconOverrides: { "bold": "<i class='your-custom-icon'></i>" },

  // if the image option is not set, images are inserted as base64
  image: {
    uploadURL: "/api/myEndpoint",
    dropzoneOptions: {}
  },

  // limit content height if you wish. If not set, editor size will grow with content.
  maxHeight: "500px",

  // set to 'true' this will insert plain text without styling when you paste something into the editor.
  forcePlainTextOnPaste: true,

  // specify editor locale, if you don't specify this, the editor will default to english.
  locale: 'hu'
}
```
Available Modules:
 - bold
 - italic
 - underline
 - link
 - code
 - unorderedList
 - removeFormat
 - separator

Available Locales:
 - english
