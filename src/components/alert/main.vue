<template>
  <transition name="el-alert-fade">
    <div
      class="el-alert"
      :class="[typeClass, center ? 'is-center' : '', 'is-' + effect]"
      v-show="visible"
      role="alert"
    >
      <i class="el-alert__icon" :class="[ iconClass, isBigIcon ]" v-if="showIcon"></i>
      <div class="el-alert__content">
        <span class="el-alert__title" :class="[ isBoldTitle ]" v-if="title || $slots.title">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="el-alert__description" v-if="$slots.default && !description"><slot></slot></p>
        <p class="el-alert__description" v-if="description && !$slots.default">{{ description }}</p>
        <i class="el-alert__closebtn" :class="{ 'is-customed': closeText !== '', 'el-icon-close': closeText === '' }" v-show="closable" @click="close()">{{closeText}}</i>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">

const TYPE_CLASSES_MAP = {
  success: 'el-icon-success',
  warning: 'el-icon-warning',
  error: 'el-icon-error',
};
export default {
  name: 'ElAlert',

  props: {
    /** 设置标题 */
    title: {
      type: String,
      default: '',
    },
    /** 设置描述 */
    description: {
      type: String,
      default: '',
    },
    /** 弹窗类型 */
    type: {
      type: String,
      default: 'info',
    },
    /** 是否能关闭 */
    closable: {
      type: Boolean,
      default: true,
    },
    /** 关闭描述 */
    closeText: {
      type: String,
      default: '',
    },
    /** 是否展示图标 */
    showIcon: Boolean,
    /** 是否居中 */
    center: Boolean,
    /** 背景类型 */
    effect: {
      type: String,
      default: 'light',
      validator(value) {
        return ['light', 'dark'].indexOf(value) !== -1;
      },
    },
  },

  data() {
    return {
      visible: true,
    };
  },

  methods: {
    close() {
      this.visible = false;
      /**
       * 关闭回调
       */
      this.$emit('close');
    },
  },

  computed: {
    typeClass() {
      return `el-alert--${this.type}`;
    },

    iconClass() {
      return TYPE_CLASSES_MAP[this.type] || 'el-icon-info';
    },

    isBigIcon() {
      return this.description || this.$slots.default ? 'is-big' : '';
    },

    isBoldTitle() {
      return this.description || this.$slots.default ? 'is-bold' : '';
    },
  },
};
</script>
