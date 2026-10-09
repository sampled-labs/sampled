import { BiMusic, BiWallet } from "react-icons/bi";
import { GiChainLightning } from "react-icons/gi";

export const SampleDetails = () => {
  return (
    <div>
      <div className="flex items-center gap-4 justify-between p-4 pt-0 rounded-md">
        <div className="flex items-center gap-2">
          <BiMusic className="text-white" size={20} />
          <p>Purchase delivery</p>
        </div>
        <div className="font-semibold text-right">IPFS download link</div>
      </div>
      <div className="flex items-center gap-4 justify-between p-4 py-3 rounded-lg bg-grey-700">
        <div className="flex items-center gap-2">
          <BiWallet className="text-white" size={20} />
          <p>Commercial licence</p>
        </div>
        <div className="font-semibold text-right">Not issued</div>
      </div>
      <div className="flex items-center gap-4 justify-between p-4 py-3 rounded-lg">
        <div className="flex items-center gap-2">
          <GiChainLightning className="text-white" size={20} />
          <p>Purchase network</p>
        </div>
        <div className="font-semibold text-right">Stellar (Soroban)</div>
      </div>
      <p className="px-4 pt-2 text-sm text-gray-400">
        A purchase records the transaction and returns the sample's stored IPFS link.
        This app does not generate a commercial licence or specify usage rights.
        Obtain any required permission from the rights holder.
      </p>
    </div>
  );
};
