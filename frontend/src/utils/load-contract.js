import contract from "@truffle/contract"; // to transform into object structure
import FaucetABI from "./contracts/Faucet.json";

export const loadContract = async () => {
  // const res = await fetch(`/contracts/${name}.json`);
  console.log("chjecking");
  const res = FaucetABI;

  const Artifact = res.json();
  return contract(Artifact);
};