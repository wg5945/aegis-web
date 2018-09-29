<template>
  <el-container>
    <slot/>
    <el-menu router unique-opened
             v-if="$store.state.common.user"
             id="app-nav"
             :collapse="$store.state.common.collapse">
      <template v-for="item in $store.state.common.menus">
        <el-submenu v-if="item.children"
                    :index="item.index"
                    :key="item.index">
          <template slot="title"
                    @click="$router.push(item.route)">
            <fa-icon fixed
                     :name="item.icon"></fa-icon>
            <span v-text="item.label"></span>
          </template>
          <el-menu-item v-for="child in item.children"
                        :index="child.index"
                        :key="child.index"
                        :route="child.route">
            <fa-icon fixed
                     :name="child.icon"></fa-icon>
            <span v-text="child.label"></span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else
                      :index="item.index"
                      :route="item.route">
          <fa-icon fixed
                   v-if="item.icon"
                   :name="item.icon"></fa-icon>
          <span v-text="item.label"
                slot="title"></span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-container>
</template>
<script lang="ts">
  import {Container, Menu, MenuItem, MenuItemGroup, Submenu} from 'element-ui';
  import Vue from 'vue';
  import Component from 'vue-class-component';
  import FaIcon from './fa-icon.vue';

  @Component({
    name: 'LeftNav',
    components: {
      FaIcon,
      ElContainer: Container,
      ElMenu: Menu,
      ElMenuItem: MenuItem,
      ElSubmenu: Submenu,
      ElMenuItemGroup: MenuItemGroup
    }
  })
  export default class LeftNav extends Vue {
  }
</script>

