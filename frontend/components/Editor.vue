<template>
  <v-card>
    <v-card-title class="headline">Editace políčka</v-card-title>

    <v-card-text>
      <div>
        x: {{ square.x }}
        y: {{ square.y }}
        <v-list>
          <v-list-item v-for="pin in pins" :key="pin.id" @click="setActivePin(pin)" :input-value="isListItemSelected(pin)">
            <v-list-item-content>
              {{ pin.name }}
            </v-list-item-content>
            <v-list-item-icon @click.stop="onDelete(pin.id)">
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="setActivePin({ x: square.x, y: square.y })" :input-value="isListItemSelected({})">
            Nový pin
          </v-list-item>
        </v-list>
      </div>
      <v-btn color="green darken-1" text v-if="activePin.id" @click="$emit('move')">Přesunout</v-btn>
      <v-form>
        <v-text-field :value="activePin.name" @change="value => setActivePin({ ...activePin, name: value })" label="Jméno"></v-text-field>
        <v-text-field :value="activePin.char" @change="value => setActivePin({ ...activePin, char: value })" label="Znak"></v-text-field>
        <v-select :items="groups" :value="activePin.group" @change="value => setActivePin({ ...activePin, group: value })" label="Skupina"></v-select>
        <v-text-field :value="activePin.x" @change="value => setActivePin({ ...activePin, x: value })" label="Souřadnice X"></v-text-field>
        <v-text-field :value="activePin.y" @change="value => setActivePin({ ...activePin, y: value })" label="Souřadnice Y"></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <div class="flex-grow-1"></div>

      <v-btn
        color="green darken-1"
        text
        @click="$emit('close')"
      >
        Zrušit
      </v-btn>

      <v-btn
        color="green darken-1"
        text
        @click="save"
      >
        Uložit
      </v-btn>
    </v-card-actions>
  </v-card>
  
</template>

<script>

export default {
  props: [
    'square',
    'pins',
  ],
  computed: {
    activePin() {
      return this.$store.state.pins.activePin
    },
    groups() {
      return [
        {
          text: 'Bizoni',
          value: 'bizoni',
        },
        {
          text: 'Ponorky',
          value: 'ponorky',
        },
        {
          text: 'Orlové',
          value: 'orlove',
        },
        {
          text: 'Mise',
          value: 'mise',
        },
      ]
    }
  },
  methods: {
    async save() {
      if (this.activePin.id) {
        await this.$strapi.updateEntry('pins', this.activePin.id, this.activePin)
      } else {
        await this.$strapi.createEntry('pins', this.activePin)
      }
      const response = await this.$strapi.getEntries('pins')
      this.$store.commit(
        'pins/set',
        response,
      )
      this.$emit('close')
    },
    async onDelete(id) {
      await this.$strapi.deleteEntry('pins', id)
      const response = await this.$strapi.getEntries('pins')
      this.$store.commit(
        'pins/set',
        response,
      )
      this.$store.commit('pins/setActive', {})
    },
    isListItemSelected(pin) {
      return pin.id === this.activePin.id
    },
    setActivePin(pin) {
      this.$store.commit('pins/setActive', pin)
    }
  }
}
</script>

<style>

</style>
