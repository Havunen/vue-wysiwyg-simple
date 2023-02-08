<template>
  <div class="wrapper">
    <wysiwyg v-model="msg"></wysiwyg>
  </div>
</template>

<script>
import {wysiwygExample} from "../tests/testdata/wysiwygexample";

export default {
  name: 'app',
  data () {
    return {
      msg: wysiwygExample
    }
  }
}
</script>

<style>
* {
  margin:0;
  padding: 0;
  box-sizing: border-box;
}
.wrapper {
  max-width: 800px;
  margin: 10em auto;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  font-family: -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Oxygen-Sans,
                Ubuntu,
                Cantarell,
                "Helvetica Neue",
                sans-serif;
}
</style>
