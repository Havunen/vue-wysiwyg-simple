import english from './locales/english';

function Emitter() {
  const self = {
    listeners: {},
    on: (eventName, handler) => {
      if (!self.listeners[eventName]) {
        self.listeners[eventName] = [];
      }
      self.listeners[eventName].push(handler);
    },
    emit: (eventName, ...args) => {
      if (self.listeners[eventName]) {
        self.listeners[eventName].forEach(handler => handler.apply(args));
      }
    }
  }

  return self;
}

const emitter = new Emitter();

emitter.options = {
    image: {
        uploadURL: "None",
        dropzoneOptions: {}
    },
    hideModules: {},
    paragraphSeparator: "div",
    maxHeight: undefined,
    customModules: [],
    locale: english
}

export default emitter;
