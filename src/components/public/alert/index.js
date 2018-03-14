import Vue from 'vue'
import alert from './alert'

const alertController = Vue.extend(alert)

let alertInstance = function(options) {
  const instance = new alertController().$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)
  instance.visible = true
  if (options.title) {
    instance.title = options.title
  }
  if (options.content) {
    instance.content = options.content
  }
  if (options.okText) {
    instance.okText = options.okText
  }
  return instance
}

alertInstance.error = function(options) {
  const instance = alertInstance(options)
  instance.type = 'error'
}

export default alertInstance