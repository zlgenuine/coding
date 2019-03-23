import tsCheckbox from './checkbox/tsCheckbox.vue';
import tsCheckboxGroup from './checkbox/tsCheckboxGroup.vue';
import tsFilter from './tsFilter.vue';
import tsSwitch from './tsSwitch.vue';
import tsImage from './tsImage.vue';
import tsLoading from './loading/directive.js';
import tsRadio from './radio/tsRadio.vue';
import tsRadioGroup from './radio/tsRadioGroup.vue';
import tsSection from './tsSection.vue';
import tsMenuTable from './menutable/tsMenuTable.vue';
import tsMenu from './menutable/tsMenu.vue';
import tsAliupload from '../aliUpload/aliUpload.vue';
import tsMenuTableItem from './menutable/tsMenuTableItem.vue';
import tsDialog from './tsDialog.vue';
import tsTable from './tables/tsTable.vue';
import tsMessageBox from './messagebox/messagebox';
import tsToast from './toast/toast';
import tsColumn from './tables/tsColumn.vue';
import tsInput from './tsInput.vue';
import tsProgress from './tsProgress.vue';
import tsSelect from './select/tsSelect.vue';
import tsButton from './tsButton.vue';
import tsNav from './tsNav.vue';
import tsTag from './tsTag.vue';
import tsForm from './forms/tsForm.vue';
import tsFormItem from './forms/tsFormItem.vue';
import tsPagination from './tsPagation.vue';
import tsGrid from './card/tsGrid.vue';
import tsGridItem from './card/tsGridItem.vue';
import tsTitleBlock from './tsTitleBlock.vue';
import tsPopover from './popover/tsPopover.vue';
import tsNavbar from './navbar/navbar.vue';
import tsTabItem from './navbar/tabItem.vue';
import tsCarousel from './carousel/carousel.vue';
import tsCarouselItem from './carousel/carousel-item.vue';
import tsTabContainer from './tab-container/tab-container.vue';
import tsTabContainerItem from './tab-container/tab-container-item.vue';
import tsCol from './layout/col.js';
import tsRow from './layout/row.js';
import tsInputNum from './tsInputNum.vue';
import tsStep from './steps/step.vue';
import tsSteps from './steps/steps.vue';
import tsDatePicker from './tsDatePicker/tsDatePicker.vue';
// =========
import pagination from '../pagination/pagination.vue';
import magnifier from '../magnifier/magnifier.vue';
// =========
const Components = {
  tsDatePicker,
  tsGrid,
  tsCol,
  tsStep,
  tsSteps,
  tsInputNum,
  tsRow,
  tsCarousel,
  tsSwitch,
  tsCarouselItem,
  tsProgress,
  tsNavbar,
  tsTabContainer,
  tsTabContainerItem,
  tsTabItem,
  pagination,
  magnifier,
  tsPopover,
  tsTitleBlock,
  tsTag,
  tsGridItem,
  tsSection,
  tsToast,
  tsRadioGroup,
  tsRadio,
  tsImage,
  tsFilter,
  tsButton,
  tsNav,
  tsCheckboxGroup,
  tsCheckbox,
  tsMenuTable,
  tsMenuTableItem,
  tsDialog,
  tsTable,
  tsColumn,
  tsPagination,
  tsInput,
  tsSelect,
  tsMenu,
  tsForm,
  tsAliupload,
  tsFormItem,
  tsLoading,
};
const install = function(Vue) {
  for (let i in Components) {
    Vue.component(i, Components[i]);
  };
  Vue.use(tsLoading);
  Vue.$messagebox = Vue.prototype.$messagebox = tsMessageBox;
  Vue.$toast = Vue.prototype.$toast = tsToast;
  Vue.prototype.$loading = tsLoading;
};
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};
Components.install = install;
export default Components;
