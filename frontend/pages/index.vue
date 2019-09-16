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
      <v-dialog :value="modalOpen" @click:outside="activeSquare = {}" max-width="320">
        <editor v-if="modalOpen" :square="activeSquare" :pins="activePins" @close="activeSquare = {}"></editor>
      </v-dialog>
      <div class="main" :style="{ width: `${mapWidth}px`, height: `${mapHeight}px` }">
        <img src="~/assets/map.png" class="img" :style="{ width: `${mapWidth}px`, height: `${mapHeight}px` }" />
        <div class="grid" :style="{ paddingLeft: `${offsetX}px`, paddingTop: `${offsetY}px` }">
          <div v-for="square in squares" :key="square.id" class="square" :style="squareStyle" @click="activeSquare = square"></div>
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
      baseSize: 20,
      offsetX: 18,
      offsetY: 8,
      mapWidth: 1920,
      mapHeight: 1085,
      activeSquare: {},
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
    pins() {
      return this.$store.state.pins.list
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
      }
    },
    squares() {
      const list = []
      for (let i = 0; (i + 1) * this.baseSize < this.mapHeight - this.offsetY; i++) {
        for (let j = 0; (j + 1) * this.baseSize < this.mapWidth - this.offsetX; j++) {
          list.push({
            x: j,
            y: i,
            id: `${j}-${i}`
          })
        }
      }
      return list
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
    }
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
}

.img {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}

.square {
  z-index: 2;
  border: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
}

.square:hover {
  background-color: rgba(255,255,255,0.3)
}
</style>
