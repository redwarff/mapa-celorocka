<template>
  <div class="pin" :style="pinStyle">
    {{ pin.char }}
  </div>
</template>

<script>
export default {
  props: [
    'pin',
    'baseSize',
    'offsetX',
    'offsetY',
  ],
  computed: {
    pinStyle() {
      return {
        width: `${this.baseSize}px`,
        height: `${this.baseSize}px`,
        top: `${this.pin.y * this.baseSize + this.offsetY}px`,
        left: `${this.pin.x * this.baseSize + this.offsetX}px`,
        backgroundColor: this.backgroundColor,
      }
    },
    backgroundColor() {
      const { group } = this.pin
      if (group === 'bizoni') {
        return '#9c4e17'
      }
      if (group === 'orlove') {
        return '#857b56'
      }
      if (group === 'ponorky') {
        return '#4c6a91'
      }
      if (group === 'mise') {
        return '#cc1439'
      } else {
        return '#000'
      }
    }
  }
}
</script>

<style>
.pin {
  position: absolute;
  border-radius: 50%;
  z-index: 3;
  border: 1px solid #fff;
  overflow: hidden;
  display: flex;
  font-size: 0.7em;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}
</style>
