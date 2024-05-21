import SignUp from "./SignUp";
import RequestReset from "./RequestReset";
import styled from "styled-components";
import UserDetails from "./userDetails";


const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

export default function Account() {
    return (
        <GridStyles>
            <UserDetails />
        </GridStyles>
    );
}
