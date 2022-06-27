import { Vue, Component } from 'vue-property-decorator';

import RadioDropdownConstructor from './radio-dropdown.vue';

@Component
export default class RadioDropdown extends Vue {
    radioDropdownInstance!: RadioDropdownConstructor;

    mounted() {
        this.radioDropdownInstance = new Vue(RadioDropdownConstructor).$mount() as RadioDropdownConstructor;
    }

    destroyed() {
        this.radioDropdownInstance.$destroy();
    }
}
