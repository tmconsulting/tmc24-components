<template>
  <transition name="tm-message-fade">
    <div
      :class="[
        'tm-message',
        type && !iconClass ? `tm-message--${ type }` : '',
        center ? 'is-center' : '',
        showClose ? 'is-closable' : '',
        customClass]"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      role="alert"
    >
      <i :class="iconClass" v-if="iconClass"></i>
      <i :class="typeClass" v-else></i>
      <slot>
        <p v-if="!dangerouslyUseHTMLString" class="tm-message__content">{{ message }}</p>
        <p v-else v-html="message" class="tm-message__content"></p>
      </slot>
      <tm-icon v-if="showClose"
               name="cross"
               class="tm-message__closeBtn"
               @click="close"></tm-icon>
    </div>
  </transition>
</template>

<script type="text/babel">
  import TmIcon from 'tmconsulting-ui/packages/icon/src/icon';

  const typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };

  export default {
    components: {
      TmIcon
    },
    data() {
      return {
        visible: false,
        message: '',
        duration: 3000,
        type: 'info',
        iconClass: '',
        customClass: '',
        onClose: null,
        showClose: false,
        closed: false,
        timer: null,
        dangerouslyUseHTMLString: false,
        center: false
      };
    },

    computed: {
      iconWrapClass() {
        const classes = ['tm-message__icon'];
        if (this.type && !this.iconClass) {
          classes.push(`tm-message__icon--${ this.type }`);
        }
        return classes;
      },

      typeClass() {
        return this.type && !this.iconClass
          ? `tm-message__icon tm-icon-${ typeMap[this.type] }`
          : '';
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      }
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose(this);
        }
      },

      clearTimer() {
        clearTimeout(this.timer);
      },

      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            if (!this.closed) {
              this.close();
            }
          }, this.duration);
        }
      },
      keydown(e) {
        if (e.keyCode === 27) { // esc关闭消息
          if (!this.closed) {
            this.close();
          }
        }
      }
    },
    mounted() {
      this.startTimer();
      document.addEventListener('keydown', this.keydown);
    },
    beforeDestroy() {
      document.removeEventListener('keydown', this.keydown);
    }
  };
</script>
