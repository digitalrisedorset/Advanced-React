import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';
import Form from './styles/Form';
//import { useNavigate } from "react-router-dom"

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # Which variables are getting passed in? And What types are they
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
    //const navigate = useNavigate()
    const { inputs, handleChange, clearForm, resetForm } = useForm({
        name: '',
        price: 0,
        description: '',
    });
    const [createProduct, { loading, error, data }] = useMutation(
        CREATE_PRODUCT_MUTATION,
        {
            variables: inputs,
            refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
        }
    );

    return (
        <Form
            onSubmit={async (e) => {
                e.preventDefault();
                console.log(inputs.image)
                // Submit the inputfields to the backend:
                const res = await createProduct()
                clearForm()
                //navigate(`/product/${res.data.createProduct.id}`);
                const id = 'clw7mo7ig000110pnux65yad7'
                //navigate(`/product/${id}`)
            }}
        >
            <fieldset disabled={loading} aria-busy={loading}>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="price">
                    Price
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="price"
                        value={inputs.price}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">+ Add Product</button>
            </fieldset>
        </Form>
    )
}