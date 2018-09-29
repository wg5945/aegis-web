<template>
  <i class="fa"
     :class="getClass()"
     :style="getStyle()"></i>
</template>
<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import {Prop} from 'vue-property-decorator';

  @Component({
    name: 'FaIcon'
  })
  export default class FaIcon extends Vue {
    @Prop(String)
    public animation: string;
    @Prop({
      type: Boolean,
      default: false
    })
    public fixed: boolean;
    @Prop({
      type: Boolean,
      default: false
    })
    public border: boolean;
    @Prop(String)
    public color: string;
    @Prop(String)
    public flip: string;
    @Prop({
      type: Boolean,
      default: false
    })
    public list: boolean;
    @Prop(String)
    public name: string;
    @Prop(Number)
    public rotate: number;
    @Prop({
      type: String,
      default: null
    })
    public size: string;


    public getStyle(): object {
      const style: { color?: string } = {};
      if (this.color) {
        style.color = this.color;
      }
      return style;
    }

    public getClass(): string {
      return `fa-${this.name}`
          + (this.fixed ? ' fa-fw' : '')
          + (this.size ? ` fa-${this.size}` : '')
          + (this.list ? ` fa-li` : '')
          + (this.animation ? ` fa-${this.animation}` : '')
          + (this.rotate ? ` fa-rotate-${this.rotate}` : '')
          + (this.flip ? ` fa-flip-${this.flip}` : '')
          + (this.border ? ` fa-border` : '');
    }
  }
</script>
<style lang="less" scoped>
  .fa-li {
    position: initial;
  }
</style>

