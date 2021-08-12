import React, { useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);

  console.log(blockchain);
  console.log(data);

  const _updateName = (_account, _name) => {
    setLoading(true);
    blockchain.smartContract.methods
      .updateName(_name)
      .send({
        from: _account,
        // value: blockchain.web3.utils.toWei("0.01", "ether"),
      })
      .once("error", (err) => {
        setLoading(false);
        console.log(err);
      })
      .then((receipt) => {
        setLoading(false);
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
      });
  };

  useEffect(() => {
    if (blockchain.account != "" && blockchain.smartContract != null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract]);

  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            onClick={(e) => {
              e.preventDefault();
              dispatch(connect());
            }}
          >
            CONNECT
          </StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg != "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Welcome to the Blockchain</s.TextTitle>
          <s.SpacerSmall />
          <s.TextDescription>Name: {data.name}</s.TextDescription>
          <s.SpacerSmall />
          <StyledButton
            disabled={loading ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              _updateName(
                blockchain.account,
                (Math.random() * 1000).toString()
              );
            }}
          >
            UPDATE NAME
          </StyledButton>
          <s.SpacerMedium />
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
