import React, { useEffect, useState, useRef } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { create } from "ipfs-http-client";
import SignatureCanvas from "react-signature-canvas";

const ipfsClient = create("https://ipfs.infura.io:5001/api/v0");

export const StyledButton = styled.button`
  padding: 8px;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [tokens, setTokens] = useState([]);
  const ipfsBasePath = "https://ipfs.infura.io/ipfs/";
  const name = "NFT Name";
  const description = "NFTS all around, whooooo!";
  const elementRef = useRef();

  const mint = (_imageUri) => {
    blockchain.smartContract.methods
      .mint(blockchain.account, _imageUri)
      .send({ from: blockchain.account })
      .once("error", function (err) {
        setLoading(false);
        dispatch(fetchData(blockchain.account));
      })
      .then((receipt) => {
        setLoading(false);
        setStatus("Your NFT is now minted.");
        clearCanvas();
        console.log(_imageUri);
        dispatch(fetchData(blockchain.account));
      });
  };

  const createMetaDataAndMint = async (_name, _description, _image) => {
    setLoading(true);
    setStatus("");
    try {
      const addedImage = await ipfsClient.add(_image);
      const metaDataObject = {
        name: _name,
        description: _description,
        image: `${ipfsBasePath}${addedImage.path}`,
      };
      const addedMetadata = await ipfsClient.add(
        JSON.stringify(metaDataObject)
      );
      console.table(metaDataObject);
      mint(`${ipfsBasePath}${addedMetadata.path}`);
      setStatus("Staring minting process.");
    } catch (err) {
      setLoading(false);
      console.log(err);
      setStatus("Sorry something went wrong, try again later.");
    }
  };

  const getImageDataFromCanvas = () => {
    const canvasElement = elementRef.current;
    var dataURL = canvasElement.toDataURL("image/png");
    const buffer = Buffer(dataURL.split(",")[1], "base64");
    return buffer;
  };

  const startMintingProcess = (_name, _description) => {
    createMetaDataAndMint(_name, _description, getImageDataFromCanvas());
  };

  const clearCanvas = () => {
    const canvasElement = elementRef.current;
    canvasElement.clear();
  };

  const fetchMetaData = () => {
    setTokens([]);
    data.allTokens.forEach((element) => {
      fetch(element.uri)
        .then((response) => response.json())
        .then((metaData) => {
          setTokens((prevState) => [
            ...prevState,
            { id: element.id, metaData: metaData },
          ]);
          console.log("Success:", metaData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.smartContract, dispatch]);

  useEffect(() => {
    fetchMetaData();
  }, [data.allTokens]);

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
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container flex={1} ai={"center"} style={{ padding: 24 }}>
          <s.TextTitle style={{ textAlign: "center" }}>
            Draw and mint your ARTWORK with {data.name}.
          </s.TextTitle>
          <s.SpacerSmall />
          {/* Upload */}
          <s.Container ai={"center"} jc={"center"}>
            {loading ? (
              <s.TextDescription>loading...</s.TextDescription>
            ) : (
              <s.Container ai={"center"} jc={"center"} fd={"row"}>
                <StyledButton
                  onClick={(e) => {
                    e.preventDefault();
                    startMintingProcess(name, description);
                  }}
                >
                  MINT
                </StyledButton>
                <s.SpacerMedium />
                <StyledButton
                  onClick={(e) => {
                    e.preventDefault();
                    clearCanvas();
                  }}
                >
                  CLEAR
                </StyledButton>
              </s.Container>
            )}
            <s.SpacerSmall />
            {status !== "" ? (
              <s.TextDescription>{status}</s.TextDescription>
            ) : null}
            <s.SpacerSmall />
            <SignatureCanvas
              penColor={"white"}
              backgroundColor={"#3271bf"}
              canvasProps={{ width: 350, height: 350 }}
              ref={elementRef}
            />
            <s.SpacerMedium />
            {tokens.length > 0 ? (
              <s.Container
                fd={"row"}
                jc={"center"}
                style={{
                  padding: 24,
                  backgroundColor: "#3b3b3b",
                  flexWrap: "wrap",
                }}
              >
                {tokens.map((item, index) => {
                  console.log(tokens);
                  return (
                    <s.Container key={index} style={{ padding: 16 }}>
                      <s.TextDescription>
                        {item.metaData.name}
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <img
                        alt={item.metaData.name}
                        src={item.metaData.image}
                        width={150}
                      />
                    </s.Container>
                  );
                })}
              </s.Container>
            ) : null}
          </s.Container>
          {/* Upload */}
          <s.SpacerMedium />
        </s.Container>
      )}
    </s.Screen>
  );
}

export default App;
