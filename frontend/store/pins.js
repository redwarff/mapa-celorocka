export const state = () => ({
  list: [],
})

export const mutations = {
  set(state, pins) {
    state.list = pins
  },
}
