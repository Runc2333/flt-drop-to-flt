import { useCallback, useState } from 'react'
import { Web3 } from 'web3'
import dayjs from 'dayjs'
import { Button, Descriptions, Popover, Modal, message } from 'antd';

// @ts-expect-error window.ethereum
const ethereum = window.ethereum;
const web3 = new Web3(ethereum);

const CONTRACT_ADDRESS = "0x6081d7F04a8c31e929f25152d4ad37c83638C62b";
const CONTRACT_ABI = [{ "inputs": [{ "internalType": "contract FluenceToken", "name": "_token", "type": "address" }, { "internalType": "contract Executor", "name": "_executor", "type": "address" }, { "internalType": "bytes32", "name": "_merkleRoot", "type": "bytes32" }, { "internalType": "uint256", "name": "_halvePeriod", "type": "uint256" }, { "internalType": "uint256", "name": "_lockupPeriod", "type": "uint256" }, { "internalType": "uint256", "name": "_initialReward", "type": "uint256" }, { "internalType": "uint256", "name": "_claimingPeriod", "type": "uint256" }, { "internalType": "address", "name": "_canceler", "type": "address" }, { "internalType": "uint256", "name": "_maxClaimedSupply", "type": "uint256" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "target", "type": "address" }], "name": "AddressEmptyCode", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "AddressInsufficientBalance", "type": "error" }, { "inputs": [], "name": "ECDSAInvalidSignature", "type": "error" }, { "inputs": [{ "internalType": "uint256", "name": "length", "type": "uint256" }], "name": "ECDSAInvalidSignatureLength", "type": "error" }, { "inputs": [{ "internalType": "bytes32", "name": "s", "type": "bytes32" }], "name": "ECDSAInvalidSignatureS", "type": "error" }, { "inputs": [], "name": "FailedInnerCall", "type": "error" }, { "inputs": [{ "internalType": "address", "name": "token", "type": "address" }], "name": "SafeERC20FailedOperation", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "userId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "account", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "bytes32", "name": "leaf", "type": "bytes32" }], "name": "Claimed", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "TransferUnclaimed", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "canceler", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint32", "name": "userId", "type": "uint32" }, { "internalType": "bytes32[]", "name": "merkleProof", "type": "bytes32[]" }, { "internalType": "address", "name": "temporaryAddress", "type": "address" }, { "internalType": "bytes", "name": "signature", "type": "bytes" }], "name": "claimTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "claimedSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "claimingEndTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "currentReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "deployTime", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "executor", "outputs": [{ "internalType": "contract Executor", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "halvePeriod", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "initialReward", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "isClaimed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "isClaimingActive", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "lockedBalances", "outputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "uint256", "name": "unlockTime", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "lockupPeriod", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxClaimedSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "merkleRoot", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "token", "outputs": [{ "internalType": "contract FluenceToken", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

function App () {
  const [loading, setLoading] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>();
  const [unlockTime, setUnlockTime] = useState<string>();
  const [log, setLog] = useState<string[]>([]);

  const handleExec = useCallback(async () => {
    setLoading(true)
    try {
      const [wallet_address] = await ethereum.request({ method: 'eth_requestAccounts' });

      const result: { amount: bigint; unlockTime: bigint } = await contract.methods.lockedBalances(wallet_address).call();
      setAmount(String(result.amount));
      setUnlockTime(dayjs.unix(Number(result.unlockTime)).format('YYYY-MM-DD HH:mm:ss'));
      setLog((prev) => [
        ...prev,
        `Token unlock time retrieved`,
        `Amount: ${result.amount}`,
        `Unlock time: ${dayjs.unix(Number(result.unlockTime)).format('YYYY-MM-DD HH:mm:ss')}`,
      ]);
    } catch (error) {
      console.error(error);
      setLog((prev) => [
        ...prev,
        `Failed to retrieve token unlock time`,
        JSON.stringify(error),
      ]);
    } finally {
      setLoading(false);
    }
  }, [])

  const handleTransfer = useCallback(async () => {
    if ((Number(amount ?? 0)) <= 0) {
      const shouldContinue = await new Promise<boolean>(resolve => {
        Modal.confirm({
          title: 'Error',
          content: 'Amount must be greater than 0, try retrieve token unlock time first. If you have already done that, this means you have no FLT-DROP tokens to convert.',
          okText: "Continue anyway",
          onOk: () => resolve(true),
          cancelText: "Cancel",
          onCancel: () => resolve(false),
        });
      });
      if (!shouldContinue) {
        return;
      }
    }

    if (dayjs().isBefore(dayjs(unlockTime))) {
      const shouldContinue = await new Promise<boolean>(resolve => {
        Modal.confirm({
          title: 'Error',
          content: 'Token unlock time has not been reached yet, you might not be able to convert FLT-DROP to FLT. Do you want to continue anyway?',
          okText: "Continue anyway",
          onOk: () => resolve(true),
          cancelText: "Cancel",
          onCancel: () => resolve(false),
        });
      });
      if (!shouldContinue) {
        return;
      }
    }

    setLog((prev) => [
      ...prev,
      `Sending transaction to convert FLT-DROP to FLT`,
    ]);

    const modal = Modal.info({
      title: 'Transaction in progress',
      content: 'Please confirm the transaction in your wallet',
      closable: false,
      okButtonProps: { style: { display: 'none' } },
    });
    const [wallet_address] = await ethereum.request({ method: 'eth_requestAccounts' });
    try {
      contract.methods.transfer(wallet_address, amount).send({
        from: wallet_address,
        gas: "100000",
      })
        .on('transactionHash', (hash) => {
          setLog((prev) => [
            ...prev,
            `Transaction hash: ${hash}`,
          ]);
          modal.update({
            title: 'Waiting for confirmation...',
            content: `Transaction hash: ${hash}`
          });
        })
        .on('confirmation', (confirmationNumber) => {
          setLog((prev) => [
            ...prev,
            `Transaction confirmed: ${confirmationNumber}`,
          ]);
          modal.update({
            title: 'Transaction confirmed',
            content: `Confirmation number: ${confirmationNumber}`
          });
        })
        .on('receipt', (receipt) => {
          setLog((prev) => [
            ...prev,
            `Transaction success: ${receipt.transactionHash}`,
          ]);
          modal.update({
            title: 'Transaction success',
            content: `Transaction hash: ${receipt.transactionHash}`
          });
          message.success('Transaction success');
        })
        .on('error', (error) => {
          setLog((prev) => [
            ...prev,
            `Transaction error`,
            JSON.stringify(error),
          ]);
          modal.update({
            title: 'Transaction error',
            content: JSON.stringify(error),
          });
          message.error('Transaction error');
        })
        .finally(() => {
          modal.destroy();
        });
    } catch (error) {
      console.error(error);
      setLog((prev) => [
        ...prev,
        `Failed to send transaction`,
        JSON.stringify(error),
      ]);
      modal.update({
        title: 'Failed to send transaction',
        content: JSON.stringify(error),
        okButtonProps: { style: { display: 'block' } },
      });
      message.error('Failed to send transaction');
    }
  }, [amount, unlockTime])

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 12 }}
        loading={loading}
        onClick={handleExec}
      >
        Retrieve token unlock time
      </Button>
      <Descriptions title="Token unlock time" bordered style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Amount">{amount}</Descriptions.Item>
        <Descriptions.Item label="Unlock time">{unlockTime}</Descriptions.Item>
      </Descriptions>
      <Popover
        title="Send transaction"
        content="Click to send transaction to convert FLT-DROP to FLT"
        placement="top"
      >
        <Button
          type="primary"
          onClick={handleTransfer}
          style={{ marginBottom: 12 }}
        >
          Convert FLT-DROP to FLT
        </Button>
      </Popover>
      <div style={{ marginBottom: 12 }}>LOG</div>
      <div style={{ width: "100vw", background: "rgba(0,0,0,0.3)", color: "white", boxSizing: "border-box", padding: 12 }}>
        {log?.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </>
  )
}

export default App
