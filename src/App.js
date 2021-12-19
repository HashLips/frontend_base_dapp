import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);

  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState("Maybe it's your lucky day!");

  const claimNFTs = (_amount) => {
    setClaimingNft(true);
    const amount = _amount || 1;
    blockchain.smartContract.methods
      .mint(blockchain.account, _amount)
      .send({
        from: blockchain.account,
        value: blockchain.web3.utils.toWei(String(0.02 * _amount), "ether"),
      })
      .once("error", (error) => {
        console.log(error);
        setFeedback("Error");
        setClaimingNft(false);
      })
      .then((receipt) => {
        setFeedback(
          "Claim successfully! Go to https://testnets.opensea.io/ to see it."
        );
        setClaimingNft(false);
      });
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);

  return (
    <s.Screen>
      {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container flex={1} ai={"center"} jc={"center"}>
          <s.TextTitle>Connect to the Rinkeby Test Net</s.TextTitle>
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
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
          <s.TextTitle style={{ textAlign: "center" }}>
            NFT Collection Name: {data.name}.
          </s.TextTitle>
          <s.SpacerSmall />
          <StyledButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              claimNFTs(1);
            }}
          >
            {claimingNft ? "Claiming..." : "Claim 1 NFT"}
          </StyledButton>
          <s.SpacerSmall />
          <StyledButton
            disabled={claimingNft ? 1 : 0}
            onClick={(e) => {
              e.preventDefault();
              claimNFTs(5);
            }}
          >
            {claimingNft ? "Claiming..." : "Claim 5 NFT"}
          </StyledButton>
          <s.SpacerSmall />
          <s.TextDescription style={{ textAlign: "center" }}>
            {feedback}
          </s.TextDescription>
          <s.SpacerMedium />
          <a href="https://testnets.opensea.io/collection/oracle-pon8otzxv2" target="_blank">Visit the 'Oracle Clone' Collection at OpenSea TestNet </a>
          <s.SpacerMedium />
          
          <a href={"https://testnets.opensea.io/" + blockchain.account} target="_blank">Visit your Collection at OpenSea TestNet </a>
          
        </s.Container>

        //  Get rinkeby ETH here: https://faucets.chain.link/rinkeby
        // Check your collection on Opensea testnet: https://testnets.opensea.io/0x06afacd25eff7940e116513e833c58000c765bd5
        //  Replace with your wallet address hash
        //  https://testnets.opensea.io/collection/oracle-pon8otzxv2
      )}
    </s.Screen>
  );
}

export default App;
