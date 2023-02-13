<template>
  <div class="editr">
    <div class="editr--toolbar">
      <Btn
        v-for="(module,i) in modules"
        :module="module"
        :options="mergedOptions"
        :key="module.title + i"
        :ref="'btn-'+module.title"
        :title="mergedOptions.locale[module.title] || module.description || ''">
      </Btn>
    </div>
    <div class="editr--content" ref="content" contenteditable="!disabled" tabindex="1" :placeholder="placeholder"></div>
  </div>
</template>

<script>
import bus from 'src/editor/bus.js';
import debounce from "debounce";
import Btn from "./Button.vue";
import bold from "./modules/bold.js";
import italic from "./modules/italic.js";
import underline from "./modules/underline.js";
import hyperlink from "./modules/hyperlink.vue";
import list_unordered from "./modules/list_unordered.js";
import removeFormat from "./modules/removeFormat.js";
import {htmlCleaner} from "./sanitizer/htmlCleaner";

const modules = [
  bold, italic, underline,
  hyperlink,
  list_unordered,
  removeFormat
];

export default {
  model: {
    prop: "html",
    event: "html"
  },

  props: {
    html: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "Enter text..."
    },
    disabled: {
      type: Boolean,
      default: false
    },
    options: Object
  },


  components: {Btn},

  data() {
    return {
      selection: ""
    }
  },

  computed: {
    mergedOptions() {
      return {...bus.options, ...this.options}
    },

    modules() {
      return modules
        .filter(
          m => this.mergedOptions.hideModules === undefined
            || !this.mergedOptions.hideModules[m.title]
        )
        .concat(this.mergedOptions.customModules);
    },

    btnsWithDashboards() {
      if (this.modules) {
        return this.modules.filter(m => m.render);
      }

      return [];
    },

    innerHTML: {
      get() {
        return htmlCleaner(this.$refs.content.innerHTML);
      },

      set(html) {
        if (this.$refs.content.innerHTML !== html) {
          this.$refs.content.innerHTML = htmlCleaner(html);
        }
      }
    }
  },

  methods: {
    saveSelection() {
      this.selection = window.getSelection();
      if (this.selection.getRangeAt && this.selection.rangeCount) {
        return this.selection.getRangeAt(0);
      }

      return null;
    },

    restoreSelection(range) {
      if (range) {
        this.selection = window.getSelection();
        this.selection.removeAllRanges();
        this.selection.addRange(range);
      }
    },
    clearSelection() {
      this.selection = null;
      const selection = window.getSelection();

      if (selection) {
        if (selection.empty !== undefined) {
          selection.empty();
        }
        if (selection.removeAllRanges !== undefined) {
          selection.removeAllRanges();
        }
      }
    },
    exec(cmd, arg, sel) {
      sel !== false && this.selection && this.restoreSelection(this.selection);
      document.execCommand(cmd, false, arg || "");
      this.clearSelection();

      this.$nextTick(this.emit);
    },

    onDocumentClick(e) {
      for (let i = 0; i < this.btnsWithDashboards.length; i++) {
        const btn = this.$refs[`btn-${this.btnsWithDashboards[i].title}`][0];

        if (btn && btn.showDashboard && !btn.$el.contains(e.target)) {
          btn.closeDashboard();
        }
      }
    },

    emit() {
      const html = this.$refs.content.innerHTML;

      this.$emit("html", html);
      this.$emit("change", html);
    },

    onInput: debounce(function () {
      this.emit();
    }, 300),

    onFocus() {
      document.execCommand("defaultParagraphSeparator", false, this.mergedOptions.paragraphSeparator)
    },

    onContentBlur() {
      // save focus to restore it later
      this.selection = this.saveSelection();
      this.$emit("blur", this.$refs.content);
    },

    async onPaste(e) {
      e.preventDefault();
      // get a plain representation of the clipboard
      let text = e.clipboardData.getData("text/html");

      if (text) {
        document.execCommand("insertHTML", false, htmlCleaner(text));

        return;
      }

      text = e.clipboardData.getData("text/plain");
      document.execCommand("insertText", false, text);
    },

    syncHTML() {
      if (this.html !== this.$refs.content.innerHTML) {
        this.innerHTML = this.html;
      }
    }
  },

  mounted() {
    this.unwatch = this.$watch("html", this.syncHTML, {immediate: true});

    document.addEventListener("click", this.onDocumentClick);

    this.$refs.content.addEventListener("focus", this.onFocus);
    this.$refs.content.addEventListener("input", this.onInput);
    this.$refs.content.addEventListener("blur", this.onContentBlur, {capture: true});
    this.$refs.content.addEventListener("paste", this.onPaste);

    this.$refs.content.style.maxHeight = this.mergedOptions.maxHeight;
  },

  beforeDestroy() {
    this.unwatch();
    document.removeEventListener("click", this.onDocumentClick);

    this.$refs.content.removeEventListener("blur", this.onContentBlur);
    this.$refs.content.removeEventListener("input", this.onInput);
    this.$refs.content.removeEventListener("focus", this.onFocus);
    this.$refs.content.removeEventListener("paste", this.onPaste);
  }
}
</script>

<style lang="scss">
.editr {
  border: 1px solid #e4e4e4;
  width: 100%;
}

.editr--toolbar {
  background: #f6f6f6;
  border-bottom: 1px solid #e4e4e4;
  position: relative;
  display: flex;
  height: 32px;

  a {
    display: inline-block;
    width: 8vw;
    max-width: 32px;
    height: 32px;
    color: #333;
    fill: #333;
    cursor: pointer;
    text-align: center;
    line-height: 1;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    &:active {
      background: rgba(0, 0, 0, 0.2);
    }

    svg {
      width: 16px;
      height: 16px;
      margin: 8px auto;

      path {
        fill: inherit;
      }
    }

    &.vw-btn-separator {
      width: 1px;
      margin: 0 8px;
      display: none;

      &:hover {
        background: initial;
        cursor: default;
      }

      i {
        &.vw-separator {
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          height: 100%;
          position: absolute;
          width: 1px;
        }
      }
    }
  }

  .dashboard {
    width: 100%;
    position: absolute;
    top: 32px;
    left: 0;
    text-align: left;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #f6f6f6;
  }
}

.editr--content {
  min-height: 150px;
  padding: 12px 8px 16px 8px;
  line-height: 1.33;
  font-family: inherit;
  color: inherit;
  overflow-y: auto;

  img {
    max-width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      text-align: left;
    }
  }

  &:focus {
    outline: 0;
  }
}

.editr--content[contenteditable=true]:empty {
  &:before {
    content: attr(placeholder);
    color: rgba(0, 0, 0, 0.3);
    display: block;
  }
}

.editr--content table th,
.editr--content table td {
  border: 1px solid #ddd;
  padding: 2px;
}

.editr--content ul li,
.editr--content ol li {
  list-style-position: inside;
}

@media screen and (max-width:320px) {
  .editr--toolbar a {
    margin: 0 2px;
  }
}
</style>
