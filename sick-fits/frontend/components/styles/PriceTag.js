import styled from 'styled-components';

const PriceTag = styled.span`
  background:  var(--red);
  transform: skew(-2deg);
  color: white;
  font-weight:200;
  padding: 5px;
  line-height: 1;
  font-size: 1.2rem;
  display: inline-block;
  position: absolute;
  top: -3px;
  right: -3px;
`;

export default PriceTag;
