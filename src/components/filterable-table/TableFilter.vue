<template>
  <div 
    v-if="hasOptions" 
    class="filter"
    :style="cssVariables"
  >
    <p
      @click="openSelect()" 
      class="trigger" 
      :class="{ 'active' : isOpen , 'has-selected' : hasSelected }"
      :style="cssVariables"
    >
      {{ title }} 
      <span v-show="hasSelected" class="option-total">{{ totalSelectedOptions }}</span>
      <svg-chevron class="trigger__icon" />
    </p>
    
    <div class="options" :class="{ 'active' : isOpen }">
      <ul class="options-ul" :class="filterClass">
        <table-filter-option 
          v-for="option in options" 
          :key="option._uid"
          :option="option"
          :selected="false"
          :tableId="tableId"
        >
        </table-filter-option>
      </ul>

      <div class="buttons">
        <button @click="clear()" class="button--clear">Clear</button>
        <button @click="cancel()" class="button--cancel">Cancel</button>
        <button @click="apply()" class="button--apply">Apply</button>
      </div>
    </div>
  </div>
</template>

<script>
  import TableFilterOption from './TableFilterOption.vue'
  import SvgChevron from './svgs/SvgChevron.vue'

  export default {
    name: 'TableFilter',

    components: { 
      TableFilterOption,
      SvgChevron
    },

    props: {
      name: {
        type: String
      },
      tableId: {
        required: true,
        type: Number,
      },
      title: {
        required: true, 
        type: String
      },
      options: {
        type: Array
      },
      type: {
        type: String
      }
    },

    data () {
      return {
        children: this.$children,
        isOpen: false,
        activeOptions: []
      }
    },

    computed: {
      cssVariables () {
        return {
          '--color-bg'                : this.config.trigger.colorBg,
          '--color-bg-active'         : this.config.trigger.colorBgActive,
          '--color-bg-hover'          : this.config.trigger.colorBgHover,
          '--color-bg-selected'       : this.config.trigger.colorBgSelected,
          '--color-border'            : this.config.trigger.colorBorder,
          '--color-border-active'     : this.config.trigger.colorBorderActive,
          '--color-border-hover'      : this.config.trigger.colorBorderHover,
          '--color-border-selected'   : this.config.trigger.colorBorderSelected,
          '--color-text'              : this.config.trigger.colorText,
          '--color-text-active'       : this.config.trigger.colorTextActive,
          '--color-text-hover'        : this.config.trigger.colorTextHover,
          '--color-text-selected'     : this.config.trigger.colorTextSelected,
          '--border-radius'           : this.config.trigger.borderRadius,
          '--font-size'                  : this.config.trigger.fontSize,
          '--height'                  : this.config.trigger.height,
          '--padding-left'            : this.config.trigger.paddingLeft,
          '--padding-right'           : this.config.trigger.paddingRight,
          
          '--apply-border-color'      : this.config.buttonApply.borderColor,
          '--apply-border-radius'     : this.config.buttonApply.borderRadius,
          '--apply-border-style'      : this.config.buttonApply.borderStyle,
          '--apply-border-width'      : this.config.buttonApply.borderWidth,
          '--apply-color-bg'          : this.config.buttonApply.colorBg,
          '--apply-color-bg-hover'    : this.config.buttonApply.colorBgHover,
          '--apply-color-border'      : this.config.buttonApply.colorBorder,
          '--apply-color-text'        : this.config.buttonApply.colorText,
          '--apply-color-text-hover'  : this.config.buttonApply.colorTextHover,
          '--apply-height'            : this.config.buttonApply.height,
          '--apply-padding-left'      : this.config.buttonApply.paddingLeft,
          '--apply-padding-right'     : this.config.buttonApply.paddingRight,
          '--apply-text-transform'    : this.config.buttonApply.textTransform,

          '--cancel-border-color'     : this.config.buttonCancel.borderColor,
          '--cancel-border-radius'    : this.config.buttonCancel.borderRadius,
          '--cancel-border-style'     : this.config.buttonCancel.borderStyle,
          '--cancel-border-width'     : this.config.buttonCancel.borderWidth,
          '--cancel-color-bg'         : this.config.buttonCancel.colorBg,
          '--cancel-color-bg-hover'   : this.config.buttonCancel.colorBgHover,
          '--cancel-color-text'       : this.config.buttonCancel.colorText,
          '--cancel-color-text-hover' : this.config.buttonCancel.colorTextHover,
          '--cancel-height'           : this.config.buttonCancel.height,
          '--cancel-padding-left'     : this.config.buttonCancel.paddingLeft,
          '--cancel-padding-right'    : this.config.buttonCancel.paddingRight,
          '--cancel-text-transform'   : this.config.buttonCancel.textTransform,

          '--clear-border-color'      : this.config.buttonClear.borderColor,
          '--clear-border-radius'     : this.config.buttonClear.borderRadius,
          '--clear-border-style'      : this.config.buttonClear.borderStyle,
          '--clear-border-width'      : this.config.buttonClear.borderWidth,
          '--clear-color-bg'          : this.config.buttonClear.colorBg,
          '--clear-color-bg-hover'    : this.config.buttonClear.colorBgHover,
          '--clear-color-text'        : this.config.buttonClear.colorText,
          '--clear-color-text-hover'  : this.config.buttonClear.colorTextHover,
          '--clear-height'            : this.config.buttonClear.height,
          '--clear-padding-left'      : this.config.buttonClear.paddingLeft,
          '--clear-padding-right'     : this.config.buttonClear.paddingRight,
          '--clear-text-transform'    : this.config.buttonClear.textTransform,
        }
      },
      // only show the select if the filter is a real filter and not just a table title
      hasOptions () {
        return this.options != undefined || this.name != undefined
      },
      config () {
        const config = this.$store.getters['filterableTable/options'](this.tableId)
        return config.filters
      },

      selectedOptions () {
        let selectedArray = []

        this.children.forEach(child => {
          if(child.isSelected){ 
            selectedArray.push(child.option) 
          }
        })

        return selectedArray
      },

      hasSelected () {
        return this.totalSelectedOptions > 0
      },

      totalSelectedOptions () {
        return this.selectedOptions.length
      },

      filterClass () {
        return 'filter__options--' + this.name.replace('_| |(|)', '-').toLowerCase()
      }
    },

    methods: {
      openSelect () {
        // if the filter is open is close it, else open it and close the others
        if(this.isOpen){
          this.isOpen = false
        } else {
          this.isOpen = true

          this.$root.$emit('clickDropdown', this.name, this.tableId)  
        }
      },

      closeSelect () {
        this.isOpen = false
      },

      cancel() {
        this.closeSelect()
        
        // reset each option to the correct state
        this.children.forEach(child => {
          child.isSelected = this.activeOptions.includes(child.option) ? true : false
        })

        // const eventLabel = `Page: PAME - Filter title: ${this.title} - Button: cancel`
        // this.$ga.event('Button', 'click', eventLabel)
      },

      clear () {
        // set the isSelected property on all options to false
        this.children.forEach(child => {
          child.isSelected = false
        })

        //todo sort out event tracking
        // const eventLabel = `Page: PAME - Filter title: ${this.title} - Button: clear`
        // this.$ga.event('Button', 'click', eventLabel)
      },

      apply () {
        this.closeSelect()
        this.activeOptions = this.selectedOptions

        const obj = {
          tableId: this.tableId,
          newOptions: {
            name: this.name,
            options: this.activeOptions
          },
          requestedPage: 1
        }
        
        this.$store.dispatch('filterableTable/applyNewFilterOptions', obj)
        this.$root.$emit('getNewItems')

        //TODO - sort out tracking
        // const eventLabel = `Page: PAME - Filter title: ${this.title} - Button: Apply`
        // this.$ga.event('Button', 'click', eventLabel)
      }
    }
  }
</script>

<style lang="scss" scoped>
// variables
$focus-outline-margin: rem-calc(4) !default;
$total-width-mobile: rem-calc(20) !default;
$total-width-desktop: rem-calc(24) !default;

$table-filter-trigger-border-color: black !default;

// mixins
@mixin svg-color($color) {
  fill: $color; 
  stroke: $color;
}

// classes
.filter {
  margin-right: rem-calc(10);
  margin-bottom: rem-calc(10);

  display: inline-block;
  position: relative;

  @include breakpoint($medium) { 
    margin-right: rem-calc(20); 
    margin-bottom: 0;
  }
}

.trigger {
  @include button-basic;
  background-color: var(--color-bg);
  border: solid 1px $table-filter-trigger-border-color;
  border-radius: 0; // IE11
  border-radius: var(--border-radius);
  color: black;
  cursor: pointer;
  font-size: 16px; // IE11
  font-size: var(--font-size);
  margin: 0;
  padding-right: 40px; // IE11
  padding-right: var(--padding-right);
  padding-left: 24px; // IE11
  padding-left: var(--padding-left);
  height: 50px; // IE11
  height: var(--height);

  align-items: center;
  display: flex;
  position: relative;

  @include breakpoint-down($medium) {
    font-size: rem-calc(16);
  }

  &:hover { 
    background-color: #333; // IE 11
    background-color: var(--color-bg-hover);
    border-color: ''; // IE11
    border-color: var(--color-border-hover);
    color: #fff; // IE11
    color: var(--color-text-hover);

    ::v-deep .svg-chevron { 
      @include svg-color(#fff); //IE11
      @include svg-color(--var(--color-text-hover)); 
    }
  }
      
  &.active {
    background-color: #009FE3; // IE11
    background-color: var(--color-bg-active);
    border-color: ''; // IE11
    border-color: var(--color-border-active);
    color: #fff; // IE11
    color: var(--color-text-active);

    ::v-deep .svg-chevron { 
      @include svg-color(#fff); //IE11
      @include svg-color(--var(--color-text-hover)); 
    }
  }

  &.has-selected {
    background-color: #009FE3; // IE11
    background-color: var(--color-bg-selected);
    color: #fff; // IE11
    color: var(--color-text-selected);

    @include breakpoint($small){ 
      padding-right: rem-calc(36); // IE11
      padding-right: var(--padding-right);
    }
    
    .trigger__icon { visibility: hidden; }
  }

  &__icon {
    width: rem-calc(10); height: rem-calc(6);

    display: block;
    position: absolute;
    right: rem-calc(16);
    top: 50%;

    transform: translateY(-50%) rotateZ(90deg);
  }

  ::v-deep .svg-chevron { 
    @include svg-color(#000); //IE11
    @include svg-color(--var(--color-text)); 
    stroke-width: 3px;
  }
}

.option-total {
  display: none;

  @include breakpoint($small) {
    background-color: #fff; // IE11
    background-color: var(--color-text-active);
    border-radius: 100%;
    color: #009FE3; // IE11
    color: var(--color-bg-active);
    font-size: rem-calc(14);
    line-height: $total-width-mobile;
    text-align: center;
    width: $total-width-mobile; height: $total-width-mobile;

    display: block;
    position: absolute;
    right: rem-calc(9);
    top: 50%;

    transform: translateY(-50%);
  }

  @include breakpoint($medium){ 
    font-size: rem-calc(18);
    line-height: $total-width-desktop;
    width: $total-width-desktop; height: $total-width-desktop;
  }
}

.options {
  background-color: white;
  font-size: rem-calc(16);
  padding: rem-calc(30 25);
  width: 100%; height: 100vh;
  
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  
  z-index: 1;

  @include breakpoint($small) {
    border: solid rem-calc(1) black;
    margin-top: rem-calc(18);
    min-width: rem-calc(460);
    width: auto; height: auto;

    position: absolute;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
  }

  &.active {
    display: block;
  }

  &-ul {
    padding: $focus-outline-margin;
    margin-bottom: rem-calc(20);
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: hidden; //for IE11
    white-space: nowrap; 

    @include breakpoint($small) {
      max-height: 40vh;
    }
  }
}

.buttons {
  margin-top: rem-calc(18);
  text-align: right;

  display: flex;
}

.button {
  &--download {
    @include breakpoint($small) { margin-left: auto; }
  }
}

$buttons: ('apply', 'cancel', 'clear', '');

@for $i from 1 to length($buttons) {
  .button--#{nth($buttons, $i)} {
    border-color: #000; // IE11
    border-radius: 2px; // IE11
    border-style: solid; // IE11
    border-width: 2px; // IE11
    background-color: #fff; // IE11
    color: #000; // IE11
    padding-right: 24px; // IE11
    padding-left: 24px; // IE11
    text-transform: capitalize; // IE11

    height: 50px; // IE11

    @if nth($buttons, $i) == 'apply' {
      border-color: #009FE3; // IE11
      background-color: #009FE3; // IE11
    }

    border-color: var(--#{nth($buttons, $i)}-border-color);
    border-radius: var(--#{nth($buttons, $i)}-border-radius);
    border-style: var(--#{nth($buttons, $i)}-border-style);
    border-width: var(--#{nth($buttons, $i)}-border-width);
    background-color: var(--#{nth($buttons, $i)}-color-bg);
    color: var(--#{nth($buttons, $i)}-color-text);
    cursor: pointer;
    padding-right: var(--#{nth($buttons, $i)}-padding-right);
    padding-left: var(--#{nth($buttons, $i)}-padding-left);
    text-transform: var(--#{nth($buttons, $i)}-text-transform);

    height: var(--#{nth($buttons, $i)}-height);

    @if nth($buttons, $i) == 'cancel' {
      margin: rem-calc(0 20 0) auto; 
    }

    &:hover {
      background-color: #333; // IE11
      background-color: var(--#{nth($buttons, $i)}-color-bg-hover);
      color: #fff;  // IE11
      color: var(--#{nth($buttons, $i)}-color-text-hover);
    }
  }
}
</style>