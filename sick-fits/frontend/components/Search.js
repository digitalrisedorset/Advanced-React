import {DropDown, DropDownItem, SearchStyles} from "./styles/DropDown";
import {useCombobox} from "downshift";
import {useLazyQuery} from "@apollo/client";
import gql from "graphql-tag";
import debounce from 'lodash.debounce';
import {useRouter} from "next/router";
import {useState} from "react";

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
  const router = useRouter()
  const [inputTerm, setInputTerm] = useState('')
  const [findItems, {loading, data, errors}] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {fetchPolicy: 'no-cache'})
  const items = data?.searchTerms || []

  const findItemsButChill = debounce(findItems, 350)
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps
  } = useCombobox({
    onInputValueChange({inputValue}) {
      setInputTerm(inputValue)
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
      router.push({
        pathname: `/product/${selectedItem.id}`
      })
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
                src={item?.photo?.image?.publicUrlTransformed}
                alt={item.name}
                width="50"
            />
            {item.name}
          </DropDownItem>
      ))}
      {isOpen && !items.length && !loading && (inputTerm.length > 2) && (
          <DropDownItem>Sorry, No items found</DropDownItem>
      )}
    </DropDown>
  </SearchStyles>
}