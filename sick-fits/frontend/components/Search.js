import {DropDown, DropDownItem, SearchStyles} from "./styles/DropDown";
import {useCombobox} from "downshift";
import {useLazyQuery} from "@apollo/client";
import gql from "graphql-tag";
import debounce from 'lodash.debounce';
//import {useNavigate} from "react-router-dom";

const SEARCH_PRODUCTS_QUERY = gql`
  query Products($where: ProductWhereInput!) {
    searchTerms: products(where: $where) {
      id
      name
      price
      description
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  //const navigate = useNavigate()
  const [findItems, {loading, data, errors}] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {fetchPolicy: 'no-cache'})
  const items = data?.searchTerms || []

  const findItemsButChill = debounce(findItems, 350)
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
      //setItems(products.filter(getProductsFilter(inputValue)))
      findItemsButChill({
        variables: {
          where: {
            OR: [
              { name: {contains:inputValue } },
              { description: {contains:inputValue } },
            ]
          }
        }
      })
    },
    onSelectedItemChange({ selectedItem }) {
      console.log('selected item changed',selectedItem)
      //navigate(`/product/${selectedItem.id}`)
    },
    items,
    itemToString: (item) => item?.name || ''
  })

  return <SearchStyles>
    <div>
      <input {...getInputProps({
        type: 'search',
        placeholder: 'Search for an item',
        id: 'search',
        className: loading?'loading':''
      })} />
    </div>
    <DropDown {...getMenuProps()}>
      {isOpen && items.map((item, index) => (
          <DropDownItem
              key={ item.id } {...getItemProps({ item })}
              highlighted={index === highlightedIndex}
          >
            <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
                width="50"
            />
            {item.name}
          </DropDownItem>
      ))}
      {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, No items found</DropDownItem>
      )}
    </DropDown>
  </SearchStyles>
}