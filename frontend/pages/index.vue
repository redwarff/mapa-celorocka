<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
      class="container"
    >
      <v-dialog :value="modalOpen && !isMoving" @click:outside="activeSquare = {}" max-width="320">
        <editor v-if="modalOpen" :square="activeSquare" :pins="activePins" @close="activeSquare = {}" @move="onMove"></editor>
      </v-dialog>
      <div class="main" :style="{ width: `${mapWidth}px`, height: `${mapHeight}px` }">
        <img src="~/assets/map.png" class="img" :style="{ width: `${mapWidth}px`, height: `${mapHeight}px` }" />
        <div class="grid" :style="{ paddingLeft: `${offsetX}px`, paddingTop: `${offsetY}px`, width: `${mapWidth}px`, height: `${mapHeight}px` }" @mousemove="onMouseMove">
          <div class="square" v-if="this.hoverSquare.x >= 0 && this.hoverSquare.y >= 0" :style="squareStyle" @click="onSquareClick"></div>
          <pin v-for="pin in pins" :key="pin.id" :pin="pin" :baseSize="baseSize" :offsetX="offsetX" :offsetY="offsetY"></pin>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import Pin from '~/components/Pin'
import Editor from '~/components/Editor'

export default {
  components: {
    Pin,
    Editor,
  },
  data () {
    return {
      baseSizeRaw: 20,
      baseOffsetX: 18,
      baseOffsetY: 8,
      baseWidth: 1920,
      baseHeight: 1085,
      scale: 1.1,
      activeSquare: {},
      isMoving: false,
      mouse: {
        x: 0,
        y: 0,
      },
    }
  },
  async asyncData({ store, app }) {
    const response = await app.$strapi.getEntries('pins')
    store.commit(
      'pins/set',
      response,
    )
  },
  computed: {
    mapWidth() {
      return this.baseWidth * this.scale
    },
    mapHeight() {
      return this.baseHeight * this.scale
    },
    baseSize() {
      return this.baseSizeRaw * this.scale
    },
    offsetX() {
      return this.baseOffsetX * this.scale
    },
    offsetY() {
      return this.baseOffsetY * this.scale
    },
    pins() {
      return this.$store.state.pins.list
    },
    hoverSquare() {
      const x = Math.floor((this.mouse.x - this.offsetX) / this.baseSize)
      const y = Math.floor((this.mouse.y - this.offsetY) / this.baseSize)
      const id = `${x}-${y}`
      return {
        x,
        y,
        id,
      }
    },
    activePins() {
      if (!this.activeSquare) {
        return []
      }
      return this.$store.state.pins.list.filter(pin => {
        return pin.x === this.activeSquare.x && pin.y === this.activeSquare.y
      })
    },
    squareStyle() {
      return {
        width: `${this.baseSize}px`,
        height: `${this.baseSize}px`,
        left: `${this.hoverSquare.x * this.baseSize + this.offsetX}px`,
        top: `${this.hoverSquare.y * this.baseSize + this.offsetY}px`,
      }
    },
    modalOpen() {
      return typeof this.activeSquare.x !== 'undefined'
    }
  },
  methods: {
    onDialogChange(val) {
      if (!val) {
        this.activeSquare = null
      }
    },
    onMove() {
      this.isMoving = true
    },
    onMouseMove(e) {
      if (e.target.classList.contains('square')) {
        return
      }
      const rect = e.target.getBoundingClientRect()
      this.mouse.x = e.clientX - rect.left
      this.mouse.y = e.clientY - rect.top
    },
    async onSquareClick() {
      const square = this.hoverSquare
      if (!this.isMoving) {
        this.activeSquare = square
        const activePin = this.activePins.length > 0
          ? this.activePins[0]
          : {
            x: square.x,
            y: square.y,
          }
        this.$store.commit('pins/setActive', activePin)
      } else {
        this.$store.commit('pins/setActive', {
          ...this.$store.state.pins.activePin,
          x: square.x,
          y: square.y,
        })
        await this.$strapi.updateEntry('pins', this.$store.state.pins.activePin.id, this.$store.state.pins.activePin)
        const response = await this.$strapi.getEntries('pins')
        this.$store.commit(
          'pins/set',
          response,
        )
        this.activeSquare = {}
        this.isMoving = false
      }
    },
  },
}
</script>

<style>
.main {
  position: relative;
}

.container {
  overflow: auto;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  z-index: 2;
}

.img {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.square {
  position: absolute;
  cursor: pointer;
  background-color: rgba(255,255,255,0.3);
}

</style>
