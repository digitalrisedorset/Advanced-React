import {DropDown, DropDownItem, SearchStyles} from "./styles/DropDown";
import {useCombobox} from "downshift";

export default function Search() {
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem
  } = useCombobox({
    onInputValueChange({inputValue}) {
      console.log('input value changed')
    },
    onSelectedItemChange({ selectedItem }) {
      console.log('selected item changed',selectedItem)

    },
    items: []
  })

  return <SearchStyles>
    <div>test</div>
  </SearchStyles>
}