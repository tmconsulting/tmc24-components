<script>
  import emitter from 'tmconsulting-ui/src/mixins/emitter';
  import Migrating from 'tmconsulting-ui/src/mixins/migrating';
  import TmIcon from 'tmconsulting-ui/packages/icon';

  export default {
    components: { TmIcon },
    name: 'TmEntityCounter',

    componentName: 'TmEntityCounter',

    mixins: [emitter, Migrating],

    inject: {
      elForm: {
        default: null
      },
      elFormItem: {
        default: null
      }
    },

    data() {
      return {
        currentValue: this.min > this.value ? this.min : this.value
      };
    },

    props: {
      declination: Array,
      placeholder: String,
      min: {
        default: 0,
        type: Number
      },
      max: {
        default: Infinity,
        type: Number
      },
      value: {
        default: 1,
        type: Number
      }
    },

    computed: {
      label() {
        return this.currentValue === 0
          ? this.placeholder
          : this.currentValue + ' ' + this.getValueLabel(this.currentValue);
      },
      className() {
        return this.currentValue === 0 ? 'tm-entity-counter--empty' : '';
      }
    },

    watch: {
      value(val) {
        this.setCurrentValue(val);
      }
    },

    methods: {
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.currentValue = value;
        this.$emit('change', value);
      },
      getValueLabel(value) {
        if (value === 1) {
          return this.declination[0];
        } else if (value < 5) {
          return this.declination[1];
        } else if (value < 21) {
          return this.declination[2];
        } else {
          return this.getValueLabel(parseInt(value.toString().slice(-1), 10));
        }
      },
      handleIncrease() {
        let newValue = this.currentValue + 1;
        if (newValue <= this.max) {
          this.setCurrentValue(newValue);
        }
      },
      handleDecrease() {
        let newValue = this.currentValue - 1;
        if (newValue >= this.min) {
          this.setCurrentValue(newValue);
        }
      }
    }
  };
</script>
<template>
  <div class="tm-entity-counter"
       :class="className">
    <button class="tm-entity-counter__button tm-entity-counter__button--left"
            @click="handleDecrease">
      <tm-icon class="tm-entity-counter__icon"
               name="minus"></tm-icon>
    </button>
    <div class="tm-entity-counter__label">
      {{ label }}
    </div>
    <button class="tm-entity-counter__button tm-entity-counter__button--right"
            @click="handleIncrease">
      <tm-icon class="tm-entity-counter__icon"
               name="plus"></tm-icon>
    </button>
  </div>
</template>
