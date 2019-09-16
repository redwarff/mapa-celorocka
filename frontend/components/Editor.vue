<template>
  <v-card>
    <v-card-title class="headline">Editace políčka</v-card-title>

    <v-card-text>
      <div>
        x: {{ square.x }}
        y: {{ square.y }}
        <v-list>
          <v-list-item v-for="pin in pins" :key="pin.id" @click="activePin = { ...pin }" :input-value="isListItemSelected(pin)">
            <v-list-item-content>
              {{ pin.name }}
            </v-list-item-content>
            <v-list-item-icon @click.stop="onDelete(pin.id)">
              <v-icon>mdi-delete</v-icon>
            </v-list-item-icon>
          </v-list-item>
          <v-list-item @click="activePin = emptyPin" :input-value="isListItemSelected({})">
            Nový pin
          </v-list-item>
        </v-list>
      </div>
      <v-form>
        <v-text-field v-model="activePin.name" label="Jméno"></v-text-field>
        <v-text-field v-model="activePin.char" label="Znak"></v-text-field>
        <v-select :items="groups" v-model="activePin.group" label="Skupina"></v-select>
        <v-text-field v-model="activePin.x" label="Souřadnice X"></v-text-field>
        <v-text-field v-model="activePin.y" label="Souřadnice Y"></v-text-field>
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

const emptyPin = {
  x: '',
  y: '',
  name: '',
  group: '',
  char: '',
}

export default {
  data() {
    return {
      activePin: {
        ...emptyPin,
        x: this.square.x,
        y: this.square.y,
      }
    }
  },
  props: [
    'square',
    'pins',
  ],
  computed: {
    emptyPin() {
      return {
        ...emptyPin,
        x: this.square.x,
        y: this.square.y,
      }
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
      this.activePin = {
        ...emptyPin,
        x: this.square.x,
        y: this.square.y,
      }
    },
    isListItemSelected(pin) {
      return pin.id === this.activePin.id
    }
  }
}
</script>

<style>

</style>
