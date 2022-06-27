<!-- 内嵌icon按钮，hover底色——加透明度主题色 -->
<template>
    <a
        class="qys-icon-button"
        :style="buttonStyle"
        @click="handleClick"
        :class="{ 'is-disabled': disabled }"
    >
        <i
            :class="iconClass"
            :style="iconStyle"
        ></i>
    </a>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'QysIconButton',
})
export default class QysIconButton extends Vue {
    @Prop()
    iconClass!: string;

    @Prop({ type: Boolean })
    disabled!: boolean;

    @Prop({ default: 16 })
    iconSize!: number;

    @Prop({
      default: 22,
    })
    size!: number;

    get iconStyle() {
      return {
        fontSize: `${this.iconSize}px`,
      };
    }

    get buttonStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        lineHeight: `${this.size}px`,
      };
    }

    handleClick() {
      if (this.disabled) return;
      this.$emit('click');
    }
}
</script>
<style lang="less" scoped>
.qys-icon-button {
    display: inline-block;
    text-align: center;
    border-radius: @border-radius-base;
    transition: all 0.3s;

    i {
        color: @color-text-regular;
    }

    &:hover {
        background: fade(@color-primary, 8%);

        i {
            color: @color-primary;
        }
    }

    &.is-disabled {
        color: @color-text-placeholder;
        cursor: no-drop;
    }
}
</style>
