const emptyPin = {
  x: '',
  y: '',
  name: '',
  group: '',
  char: '',
}

export const state = () => ({
  list: [],
  activePin: emptyPin,
})


export const mutations = {
  set(state, pins) {
    state.list = pins
  },
  setActive(state, pin) {
    state.activePin = {
      ...emptyPin,
      ...pin
    }
  }
}
