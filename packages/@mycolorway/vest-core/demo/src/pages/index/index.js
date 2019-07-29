import testBehavior from './test-behavior'
import { Component } from '@mycolorway/vest-core'
import { mapActions, mapMutations, mapGetters, mapState } from '@mycolorway/vest-core/store'

Component({

  behaviors: [testBehavior],

  data: {
    age: 10
  },

  computed: {
    ...mapState(['name']),

    ...mapGetters('child', {
      childName: 'name'
    }),

    info() {
      return JSON.stringify({
        name: this.data.name,
        childName: this.data.childName,
        age: this.data.age
      })
    }
  },

  watch: {
    age(val, oldValue) {
      console.log(`age changed from ${oldValue} to ${val}`)
    },
    childName: '_childNameChaned'
  },

  lifetimes: {
    attached() {
      console.log('from page')
      this.updateName('lalala')
      this.updateLastName('hahaha')
      this.loadChildLastName()

      setTimeout(() => {
        this.setData({ age: 20 })
      }, 1000)
    }
  },

  methods: {
    ...mapMutations(['updateName']),

    ...mapMutations('child', ['updateLastName']),

    ...mapActions(['loadName']),

    ...mapActions('child', {
      loadChildLastName: 'loadLastName'
    }),

    _childNameChaned(val, oldValue) {
      console.log(`childName changed from ${oldValue} to ${val}`, this)
    }
  }

})
