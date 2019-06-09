import Vue from 'vue';

import { storiesOf } from '@storybook/vue';

import VGrid from '../../src/components/Grid.vue';
import '../../src/styles/main.css';


storiesOf('Grid', module)
  .add('story as a template', () => {'<v-grid />'});