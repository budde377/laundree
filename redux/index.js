/**
 * Created by budde on 28/05/16.
 */
const {createStore} = require('redux')
const reducer = require('./reducer')
const actions = require('./actions')
const lodash = require('lodash')

function mapFlash (flashArray, type) {
  return flashArray
    .map((message) => ({type: type, message: message}))
    .map((flash) => actions.flash(flash))
}

/**
 * Create initial store
 * @param {UserHandler} currentUser
 * @param {Array=} successFlash
 * @param {Array=} errorFlash
 * @return {Promise}
 */
function createInitialEvents (currentUser, successFlash = [], errorFlash = []) {
  var events = mapFlash(successFlash, 'success')
  events = events.concat(mapFlash(errorFlash, 'error'))
  if (!currentUser) return Promise.resolve(events)
  events.push(actions.signInUser(currentUser))

  return currentUser.fetchLaundries()
    .then((laundries) => Promise.all(laundries.map((laundry) => laundry.fetchMachines()))
      .then((machines) => ({laundries, machines: lodash.flatten(machines)})))
    .then(({laundries, machines}) => {
      laundries = laundries.filter((l) => l)
      machines = machines.filter((m) => m)
      if (!laundries.length) return events
      events.push(actions.listLaundries(laundries))
      events.push(actions.listMachines(machines))
      return events
    })
}

function createInitialStore (currentUser, successFlash = [], errorFlash = []) {
  return createInitialEvents(currentUser, successFlash, errorFlash)
    .then((events) => {
      const store = createStore(reducer)
      events.forEach((event) => store.dispatch(event))
      return store
    })
}

module.exports = {
  createInitialStore, createInitialEvents, actions, reducer
}