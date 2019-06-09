<template lang="pug">
div
  v-navigation-drawer(
    v-model="drawer"
    width="256"
    :mini-variant="mini"
    persistent
    enable-resize-watcher
    :dark="dark"
    app)
    .pa-2.text-xs-center(v-show="!mini")
      // div(style="padding-left:5em")
      //   v-switch(:label="(!dark ? 'Light' : 'Dark') + ' Theme'", v-model="dark", :dark="dark", hide-details)
    .pa-3.text-xs-center(v-show="mini")
      .display-2 A

    v-list(dense)
      template(v-for='item in menu')
        v-list-group(v-if='item.items', :key="item.title")
          v-list-tile(slot='activator', :title="item.title")
            v-list-tile-action(style="width:32px")
              v-icon(size="22") {{ item.icon }}
            v-list-tile-content
              v-list-tile-title {{ item.title }}

          v-list-tile(
            v-for='subItem in item.items'
            :key='subItem.href'
            :to='subItem.href'
            v-bind:disabled='subItem.disabled'
            v-bind:target='subItem.target')
            v-list-tile-action
              v-icon
            v-list-tile-content
              v-list-tile-title {{ $t(subItem.title) }}

        div.text-xs-center.title(v-else-if='item.mainHeader') {{ item.mainHeader }}
          v-divider.mt-3

        v-subheader(v-else-if='item.header') {{ item.header }}
        v-divider(v-else-if='item.divider')
        v-list-tile(v-else, :to='item.href', router, ripple, v-bind:disabled='item.disabled', :title="item.title")
          v-list-tile-action
            v-icon {{ item.icon }}
          v-list-tile-content
            v-list-tile-title {{ $t(item.title) }}
          v-list-tile-action(v-if='item.subAction')
            v-icon.success--text {{ item.subAction }}

  v-toolbar.darken-1(fixed, dark, :class="theme" app)
    v-toolbar-side-icon(dark, @click.stop='drawer = !drawer')
    v-toolbar-title {{$t(pageTitle)}}
    v-spacer
    v-badge.mx-2(icon color="red" )
      v-icon(dark) mail

    v-menu(offset-y)
      v-btn(icon, dark, slot="activator")
        v-icon(dark) language
      v-list
        v-list-tile(v-for="lang in locales" :key="lang",@mouseover.native="changeLocale(lang)")
          v-list-tile-title {{lang}}

    // v-menu(offset-y)
    //   v-btn(icon, dark, slot="activator")
    //     v-icon(dark) format_paint
    //   v-list
    //     v-list-tile(v-for="n in colors", :key="n", :class="n",@mouseover.native="theme = n")

  v-content.pt-5
    v-container(fluid)
      v-slide-y-transition(mode='out-in')
        router-view(:key="$route.fullPath")
</template>

<script lang="ts" src="./Main.ts"></script>

<style>
</style>