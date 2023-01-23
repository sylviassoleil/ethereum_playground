import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers'
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import 'ethers';
// import ipfs from './ipfs';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
//import Token from './artifacts/contracts/Token.sol/Token.json'
import APToken from './artifacts/contracts/APToken.sol/APToken.json'
import PriceConsumerV3 from './artifacts/contracts/ETHPrice.sol/PriceConsumerV3.json'
import StoreHash from './artifacts/contracts/StoreHash.sol/StoreHash.json'
import {Container, Form} from 'react-bootstrap';

import {
    AppBar, Toolbar,
    TextField, Typography,
    Button, Grid,
    Card, CardContent,
    Input, IconButton,
    TableRow,
    TableHead, Table,
    TableCell, TableBody
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import StyledPaper from "./styledPaper"
import {Buffer} from "buffer";
import PublishIcon from '@mui/icons-material/Publish';

const IPFS = require('ipfs-api');
const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
var numbro = require("numbro");

// local network
// const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
// const priceAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const greeterAddress = "0xf046245ede4FE4AB7E59a974BAAd658386ea9262"
const tokenAddress = "0xa1c51Db232867f688C49c4C5F67708D2b21CC0A5"
const priceAddress = "0x73Cdd2dd0257eD77C43575BF226d5F6c19472c97"
const storehashAddress = "0xA6505B88068Af708Ceb8320733aEDFd9053d1C75"

const useStyles = makeStyles((theme) => ({
    root: {
        // paddingTop: theme.spacing(1),
        fontFamily: "Helvetica",
        '&:hover': {
            background: "#F0F8FF",
        },
        "&$selected > $content": {
            color: "#F0F8FF"
        }
    },
    tree: {},
    appBar: {
        colorTransparent: "transparent",
        position: "static",
        // color: "#585858",
        width: "vh",
        backgroundColor: "#04a4fc",
        variant: "dense",
        fontWeight: "bold",
    },
    titleItem: {
        fontFamily: "Helvetica",
        /* "initial",*/
        fontWeight: "bold",
        fontSize: "medium",
        color: "#585858"

    },
    subItem: {
        fontFamily: "Segoe UI",
        fontWeight: "lighter",
        fontSize: "medium"
    },
    buttonText: {
        fontFamily: "Segoe UI",
        fontWeight: "lighter",
        fontSize: "1.2em",
        color: "#585858",
        position: "inline-flex",
        outlineColor: "#F0F8FF",
        width: "35vh",
        justifyContent: 'left',
        display: 'flex',
        variant: 'outlined'
    },
    greetingText: {
        fontFamily: "Helvetica",
        fontWeight: "lighter",
        fontSize: "1.8em",
        color: "#585858"
    }
}));

const gunnarStyle= { height: "10px", padding: "0px"};
function App() {
    const classes = useStyles();

    const [greeting, setGreetingValue] = useState()
    const [userAccount, setUserAccount] = useState()
    const [amount, setAmount] = useState()
    const [balance, setBalance] = useState()
    const [price, setPrice] = useState()
    const [open, setOpen] = React.useState(false);

    const [ipfsHash, setIpfsHash] = useState();
    const [buffer, setBuffer] = useState();
    const [ethAddress, setEthAddress] = useState();
    const [transactionHash, setTransactionHash] = useState();

    const captureFile = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const file = event.target.files[0]
        let reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => convertToBuffer(reader)
    }

    async function convertToBuffer(reader) {
        //file is converted to a buffer to prepare for uploading to IPFS
        const bufferRes = await Buffer.from(reader.result);
        //set this buffer -using es6 syntax
        setBuffer(bufferRes);
        console.log("Buffer: ", buffer)
    }

    async function sendFile(event) {
        event.preventDefault();

        //bring in user's metamask account address
        const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
        console.log('Sending from Metamask account: ' + account);

        //obtain contract address from storehash.js
        setEthAddress(storehashAddress);

        //save document to IPFS,return its hash#, and set hash# to state
        //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add
        await ipfs.add(buffer, async (err, ipfsHashNew) => {
            console.log("Submitting file to ipfs...");
            console.log(err, ipfsHashNew);
            //setState by setting ipfsHash to ipfsHashNew[0].hash
            await setIpfsHash(ipfsHashNew[0].hash);
            console.log("Got hash: ", ipfsHash);

            if (typeof window.ethereum !== 'undefined') {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner()
                const contract = new ethers.Contract(storehashAddress, StoreHash.abi, signer)
                try {
                    const data = await contract.sendHash(account)
                    console.log('data: ', data)
                    setTransactionHash(data.hash)
                } catch (err) {
                    console.log("Error: ", err)
                }
            }
        }) //await ipfs.add
    } //onSubmit
    // const handleClickOpen = () => {
    //     setOpen(true);
    // };

    // const handleClose = () => {
    //     setOpen(false);
    // };

    async function requestAccount() {
        await window.ethereum.request({method: 'eth_requestAccounts'});
    }

    async function fetchGreeting() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            console.log({provider})
            const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
            try {
                const data = await contract.greet()
                console.log('data: ', data)
                setGreetingValue(data)
                // return data;
            } catch (err) {
                console.log("Error: ", err)
            }
        }
    }

    async function getBalance() {
        if (typeof window.ethereum !== 'undefined') {
            const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(tokenAddress, APToken.abi, provider)
            const balance = await contract.balanceOf(account);
            // as the token has 18 decimals, the value returned is actually multipled ^1e18
            console.log("Balance: ", (balance / 1000000000000000000).toString());
            setBalance(balance / 1000000000000000000)
        }
    }

    async function setGreeting() {
        if (!greeting) return
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            console.log({provider})
            const signer = provider.getSigner()
            const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
            const transaction = await contract.setGreeting(greeting)
            await transaction.wait()
            fetchGreeting()
        }
    }

    async function sendCoins() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(tokenAddress, APToken.abi, signer);

            // as the token has 18 decimals, the value returned is actually multipled ^1e18
            // when multipled 1e18, will report big number error
            // therefore, use the workaround of using ether BigNumber
            const transaction = await contract.transfer(userAccount, ethers.BigNumber.from(String(amount) + "0".repeat(18)));
            await transaction.wait();
            console.log(`${amount} Coins successfully sent to ${userAccount}`);
        }
    }

    async function getPrice() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(priceAddress, PriceConsumerV3.abi, signer);
            const price = await contract.getLatestPrice();
            setPrice(price.toString())
            console.log("ETH/USD: ", price.toString())
        }
    }

    return (
        // <div className="App">
        <React.Fragment>
            <img src="https://drive.google.com/uc?export=view&id=1bDRloMr2xLgvsZ1Pnb1nHKYIM3PvdXnI"
            height="60"
            />
            <StyledPaper>
                <Grid container spacing={2} columns={12}
                      alignItems="stretch">
                    <Grid item xs={4}>
                        <Card style={{height: "100%"}}>
                            <CardContent>
                                <AppBar className={classes.appBar}>
                                    <Toolbar className={classes.appBar}>
                                        Contract 1: Hello World
                                    </Toolbar>
                                </AppBar>
                                <br/>
                                <Button className={classes.buttonText} variant='outlined'
                                        onClick={fetchGreeting}>
                                    Fetch Greeting
                                </Button>

                                <br/>
                                <Button variant='contained'
                                        className={classes.buttonText} onClick={setGreeting}>
                                    Set Greeting
                                </Button>

                                <TextField
                                    className={classes.buttonText}
                                    label="Message"
                                    position="inline-flex"
                                    color="#04a4fc"
                                    margin="normal"
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{shrink: true}}
                                    // inputProps={{style: {fontSize: 40}}} // font size of input text
                                    onChange={e => setGreetingValue(e.target.value)}
                                    value={greeting}
                                />

                                {/*<input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting"*/}
                                {/*       value={greeting}/>*/}
                                <AppBar className={classes.appBar}>
                                    <Toolbar className={classes.appBar}>
                                        Contract 2: An ERC20 Token
                                    </Toolbar>
                                </AppBar>
                                <br/>
                                <Button variant='outlined'
                                        className={classes.buttonText}
                                        onClick={getBalance}> Get Balance</Button>
                                <TextField
                                    className={classes.buttonText}
                                    label="Connected Account APT Balance"
                                    position="inline-flex"
                                    color="#04a4fc"
                                    margin="normal"
                                    variant="outlined"
                                    size="small"
                                    value={!balance?'':numbro(balance).format({ thousandSeparated: true,
                                        mantissa: 2})}
                                    InputLabelProps={{shrink: true}}
                                />
                                <Button display='flex' variant='contained'
                                        className={classes.buttonText} onClick={sendCoins}>
                                    Transfer
                                </Button>
                                <TextField
                                    className={classes.buttonText}
                                    label="Account ID"
                                    position="inline-flex"
                                    color="#04a4fc"
                                    margin="normal"
                                    variant="outlined" size="small"
                                    // inputProps={{style: {fontSize: 40}}} // font size of input text
                                    // InputLabelProps={{style: {fontSize: 40}}} // font size of input label
                                    onChange={e => setUserAccount(e.target.value)}
                                />
                                <TextField
                                    className={classes.buttonText}
                                    label="Amount"
                                    position="inline-flex"
                                    color="#04a4fc"
                                    margin="normal"
                                    variant="outlined" size="small"
                                    // inputProps={{style: {fontSize: 40}}} // font size of input text
                                    // InputLabelProps={{style: {fontSize: 40}}} // font size of input label
                                    onChange={e => setAmount(e.target.value)}
                                />

                            </CardContent>
                        </Card>

                    </Grid>
                    <Grid item xs={8}>
                        <Card style={{height: "100%"}}>
                            <CardContent>
                                <AppBar className={classes.appBar}>
                                    <Toolbar className={classes.appBar}>
                                        Contract 3: Chainlink - Request Latest Price
                                    </Toolbar>
                                </AppBar>
                                <br/>
                                <Button variant='outlined'
                                        className={classes.buttonText}
                                        onClick={getPrice}>
                                    Get Price
                                </Button>

                                <TextField
                                    className={classes.buttonText}
                                    label="ETH/USD Latest Price **Testnet**"
                                    position="inline-flex"
                                    color="#04a4fc"
                                    margin="normal"
                                    variant="outlined"
                                    size="small"
                                    InputLabelProps={{shrink: true}}
                                    value={ !price? '' : price/10**8 }
                                />
                                <Button disabled className={classes.buttonText}> &nbsp; </Button>
                                <br/>

                                <AppBar className={classes.appBar}>
                                    <Toolbar className={classes.appBar}>
                                        Contract 4: Infura - Upload local files to IPFS
                                    </Toolbar>
                                </AppBar>
                                <br/>
                                <Container>
                                    <Form onSubmit={sendFile}>
                                        <Input
                                            type="file"
                                            onChange={captureFile}
                                            className={classes.buttonText}
                                            size="small"
                                            styles={{
                                                fontFamily: "Roboto",
                                                fontWeight: "lighter",
                                                color: "#585858",
                                            }}
                                        />
                                        <br/>
                                        <Button
                                            bsStyle="primary"
                                            variant='contained'
                                            className={classes.buttonText}
                                            type="submit">
                                            Send it
                                        </Button>
                                    </Form>

                                    <br/>
                                    <hr/>

                                    <Table style={gunnarStyle}>
                                        {/*<Thead>*/}
                                        <TableHead style={gunnarStyle}>
                                            <TableRow  style={gunnarStyle}>
                                                <TableCell align="left" className={classes.titleItem} component="div" style={gunnarStyle}>
                                                    Tx Receipt Category
                                                </TableCell>
                                                <TableCell align="center" className={classes.titleItem} component="div" style={gunnarStyle}>
                                                    Values
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            <TableRow style={gunnarStyle}>
                                                <TableCell style={gunnarStyle}>IPFS Hash # stored on Eth Contract</TableCell>
                                                <TableCell style={gunnarStyle}>
                                                    <a href={'https://ipfs.infura.io/ipfs/' + ipfsHash}>
                                                        {!ipfsHash ? '' : 'https://ipfs.infura.io/ipfs/' + ipfsHash}
                                                    </a>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow style={gunnarStyle}>
                                                <TableCell style={gunnarStyle}>Ethereum Contract Address</TableCell>
                                                <TableCell style={gunnarStyle}>{ethAddress}</TableCell>
                                            </TableRow>
                                            <TableRow style={gunnarStyle}>
                                                <TableCell style={gunnarStyle}>Tx Hash #</TableCell>
                                                <TableCell style={gunnarStyle}>{transactionHash}</TableCell>
                                            </TableRow>
                                        </TableBody>

                                    </Table>
                                </Container>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

            </StyledPaper>
        </React.Fragment>
    )
        ;
}

// export default () => (
//
<Popup trigger={<button> Trigger</button>} position="right center">
    // <div>Popup content here !!</div>
    // </Popup>
// );
export default App;
